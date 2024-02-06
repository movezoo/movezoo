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

  const joinSession = async () => {
    OV = new OpenVidu();
    OV.enableProdMode();

    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      // deleteSubscriber(event.stream.streamManager);
    });

    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const token = await getToken();
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
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

          newSession.publish(newPublisher);

          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);

          myGameData.playerId = myUserName;
          let existMyData = false;
          playerGameDataList.forEach((item) => {
            if (item === myGameData.playerId) {
              existMyData = true;
            }
          });
          if (!existMyData) playerGameDataList.push(myGameData);

          console.log(
            `joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`
          );
        })
        .catch((error) => {
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };
  

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    setSession(undefined);
    setSubscribers([]);
    setMySessionId(state.session);
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

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

              {/* 메인 비디오 */}
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
