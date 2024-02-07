// import { useLocation } from "react-router-dom";
// import styles from "./Multi.module.css";
// import Back from "../../components/multi/Back";
// import Map from "../../components/multi/Map";
// import Chat from "../../components/multi/Chat";
// import Ready from "../../components/multi/Ready";
// import Cam from "../../components/play/Cam";

// function Multi() {
//   const { state } = useLocation()

//   return (
//     <div>
//       <div className={styles.container}>
//         {/*왼쪽 영역*/}
//         <div className={styles.leftSection}>
//           <div className={styles.infoSection}>
//             <div className={styles.goBack}>
//               <Back />
//             </div>
//             <h1 style={{ margin: 10 }}>Multi Play</h1>
//           </div>
//           <div className={styles.userSection}>

//             <Cam />
//             <div className={styles.userBox}>
//               유저 1
//             </div>
//             <div className={styles.userBox}>유저 2</div>
//             <div className={styles.userBox}>유저 3</div>
//             <div className={styles.userBox}>유저 4</div>
//           </div>
//           {/* {loading ? (
//             <h1 className={styles.txtLoading}>Loading...</h1>
//           ) : (
//             <Webcam className={styles.webCam} mirrored={true} />
//           )} */}

//           {/* <div>
//             <button className={styles.btnSelect}>카트 고르기</button>
//           </div> */}
//         </div>
//         {/*오른쪽 영역*/}
//         <div className={styles.rightSection}>
//           {/*맵*/}
//           <div className={styles.btnSelectMap}>
//             <Map />
//           </div>
//           {/* 채팅 */}
//           <div className={styles.areaChat}>
//             <Chat />
//           </div>
//           {/* 준비 버튼*/}
//           <div className={styles.btnReady}>
//             <Ready />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Multi;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { myGameData, playerGameDataList } from "../../components/play/data.js";

import styles from "./Multi.module.css";

import Back from "../../components/multi/Back";
import Map from "../../components/multi/Map";
import Chat from "../../components/multi/Chat";
import Ready from "../../components/multi/Ready";
import Cam from "../../components/play/Cam";
import UserVideoComponent from "../../components/play/UserVideoComponent";
import MyVideoComponent from "../../components/play/MyVideoComponent";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

const Multi = (props) => {
  const { state } = useLocation()
  // 게임시작관리(props로 념겨줌)
  const [isGameStart, setIsGameStart] = useState(false);
  const [mySessionId, setMySessionId] = useState(state.session);
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  // 세션 및 스트림 관리 상태
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  if(props.isGameStart) {
    setMySessionId(props.mySessionId);
    setIsGameStart(true)
  }

  let OV, currentVideoDevice;
  useEffect(() => {
    const onbeforeunload = () => {
      leaveSession();
    };
    window.addEventListener("beforeunload", onbeforeunload);
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  // const enterRoom = (sessionId) => {
  //   setSession(sessionId)
  //   joinSession();
  // }

  // 세션에 참여하는 함수
  const joinSession = async () => {
    // OpenVidu 객체 생성
    OV = new OpenVidu();
    OV.enableProdMode();
  
    // 새 세션 초기화
    const newSession = OV.initSession();
    setSession(newSession);
  
    // 새 스트림 생성 이벤트 핸들러
    newSession.on("streamCreated", (event) => {
      // 새로운 스트림을 구독하고 구독자 목록에 추가
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });
  
    // 스트림 소멸 이벤트 핸들러
    newSession.on("streamDestroyed", (event) => {
      // 여기에 스트림 소멸 시 수행할 작업 작성 가능
      // 예: deleteSubscriber(event.stream.streamManager);
    });
  
    // 예외 발생 시 핸들러
    newSession.on("exception", (exception) => {
      console.warn(exception);
    });
  
    try {
      // 토큰 가져오기
      const token = await getToken();
  
      // 토큰으로 세션에 연결
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          // 새로운 퍼블리셔 생성
          let newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });
  
          // 새로운 퍼블리셔를 세션에 발행
          newSession.publish(newPublisher);
  
          // 사용 가능한 비디오 장치 가져오기
          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          // 현재 비디오 장치 ID 가져오기
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          // 현재 비디오 장치 가져오기
          currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );
  
          // 메인 스트림 매니저 및 퍼블리셔 설정
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
  
          // 사용자 게임 데이터 설정
          myGameData.playerId = myUserName;
          let existMyData = false;
          // 중복 데이터 확인 후 추가
          playerGameDataList.forEach((item) => {
            if (item === myGameData.playerId) {
              existMyData = true;
            }
          });
          if (!existMyData) playerGameDataList.push(myGameData);
  
          // 디버그 로그
          console.log(
            `joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`
          );
        })
        .catch((error) => {
          // 연결 중 오류 발생 시 로그 출력
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      // 오류 발생 시 로그 출력
      console.error("Error joining session:", error);
    }
  };
  

  // 세션을 떠나는 함수
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    setSession(undefined);
    setSubscribers([]);
    setMySessionId(undefined);
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  // 카메라 변경 함수
  const switchCamera = async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  // mySessionId로 새로운 세션 생성
  const createSession = async (sessionId) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/openvidu/sessions",
        { customSessionId: sessionId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  // mySessionId로 만든 세션을 받아와 토큰 생성
  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL +
          `api/openvidu/sessions/${sessionId}/connections`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };

  return (
    <div className={styles.container}>






      {/*왼쪽 영역*/}
      <div className={styles.leftSection}>
        <div className={styles.infoSection}>
          <div className={styles.goBack}>
            <Back />
          </div>
          <h1 style={{ margin: 10 }}>Multi Play</h1>
        </div>







        {/* User 영역 */}
        <div className={styles.userSection}>
          {session === undefined ? (
            <div id="join">
              <div id="join-dialog" className="jumbotron vertical-center">
                <form className="form-group" onSubmit={joinSession}>
                  <p>
                    <label>Participant: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="userName"
                      value={myUserName}
                      onChange={handleChangeUserName}
                      required
                      style={{ color: "black" }}
                    />
                  </p>
                  <p>
                    <label> Session: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="sessionId"
                      value={mySessionId}
                      onChange={handleChangeSessionId}
                      required
                      style={{ color: "black" }}
                    />
                  </p>
                  <p className="text-center">
                    <input
                      className="btn btn-lg btn-success"
                      style={{ color: "black" }}
                      name="commit"
                      type="submit"
                      value="JOIN"
                    />
                  </p>
                </form>
              </div>
            </div>
          ) : null}

          {session !== undefined ? (
            <div id="session">
              <div id="session-header">
                <h1 id="session-title">{mySessionId}</h1>
                <input
                  className="btn btn-large btn-danger"
                  type="button"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                  value="Leave session"
                />
                <input
                  className="btn btn-large btn-success"
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={switchCamera}
                  value="Switch Camera"
                />
              </div>

              {/* 내 비디오 */}
              {mainStreamManager !== undefined ? (
                <div id="main-video" className={styles.userBox}>
                  <MyVideoComponent
                    streamManager={mainStreamManager}
                    mySession={session}
                  />
                </div>
              ) : null}

              {/* 다른 사용자 비디오 */}
              <div id="video-container" className="col-md-6">
                {subscribers.map((sub, i) => (
                  <div
                    key={sub.id}
                    className={styles.userBox} 
                    onClick={() => handleMainVideoStream(sub)}
                  >
                    <span>{sub.id}</span>
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>








        {/* {loading ? (
            <h1 className={styles.txtLoading}>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )} */}

        {/* <div>
            <button className={styles.btnSelect}>카트 고르기</button>
          </div> */}
      </div>






      {/*오른쪽 영역*/}
      <div className={styles.rightSection}>
        {/*맵*/}
        <div className={styles.btnSelectMap}>
          <Map />
        </div>
        {/* 채팅 */}
        <div className={styles.areaChat}>
          <Chat />
        </div>
        {/* 준비 버튼*/}
        <div className={styles.btnReady} onClick={()=>{setIsGameStart(true);console.log(`game start!!!`)}}>
          <Ready mySessionId={mySessionId} isGameStart={isGameStart}/>
        </div>
      </div>
      
      








    </div>
  );
};

export default Multi;
