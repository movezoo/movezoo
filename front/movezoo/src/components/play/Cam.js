// import { OpenVidu } from "openvidu-browser";

// import axios from "axios";
// import { Component } from "react";
// import "./Cam.css";
// import UserVideoComponent from "./UserVideoComponent";
// import MyVideoComponent from "./MyVideoComponent";

// import { myGameData, playerGameDataList } from './data.js';

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";
//   // process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";
//   // process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

// class Cam extends Component {
//   constructor(props) {
//     super(props);

//     // These properties are in the state's component in order to re-render the HTML whenever their values change
//     // 이러한 속성은 값이 변경될 때마다 HTML을 다시 렌더링하기 위해 상태 구성 요소에 있습니다
//     this.state = {
//       mySessionId: "SessionC", // 초기 세션 ID
//       myUserName: "Participant" + Math.floor(Math.random() * 100), // 무작위 숫자를 포함한 초기 사용자명
//       session: undefined, // OpenVidu 세션 객체
//       mainStreamManager: undefined, // 페이지의 주 비디오. 'publisher' 또는 'subscribers' 중 하나
//       publisher: undefined, // 사용자의 비디오 스트림 (발행자)
//       subscribers: [], // 다른 참가자들의 비디오 스트림 정보를 저장하는 배열
//     };

//     // 메소드를 컴포넌트 인스턴스에 바인딩
//     this.joinSession = this.joinSession.bind(this);
//     this.leaveSession = this.leaveSession.bind(this);
//     this.switchCamera = this.switchCamera.bind(this);
//     this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
//     this.handleChangeUserName = this.handleChangeUserName.bind(this);
//     this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
//     this.onbeforeunload = this.onbeforeunload.bind(this);
//   }

//   componentDidMount() {
//     // 'beforeunload' 이벤트에 대한 이벤트 리스너 추가
//     window.addEventListener("beforeunload", this.onbeforeunload);
//   }
  
//   componentWillUnmount() {
//     // 컴포넌트가 언마운트될 때 'beforeunload' 이벤트에 대한 이벤트 리스너 제거
//     window.removeEventListener("beforeunload", this.onbeforeunload);
//   }
  
//   // 브라우저가 닫히기 전에 호출되는 이벤트 핸들러
//   onbeforeunload(event) {
//     this.leaveSession(); // 세션을 떠나는 메소드 호출
//   }
  
//   // 세션 ID 입력값 변경 시 호출되는 메소드
//   handleChangeSessionId(e) {
//     this.setState({
//       mySessionId: e.target.value,
//     });
//   }
  
//   // 사용자명 입력값 변경 시 호출되는 메소드
//   handleChangeUserName(e) {
//     this.setState({
//       myUserName: e.target.value,
//     });
//   }
  
//   // 주 비디오 스트림 변경 시 호출되는 메소드
//   handleMainVideoStream(stream) {
//     // 현재 주 비디오 스트림이 변경된 경우에만 상태 업데이트
//     if (this.state.mainStreamManager !== stream) {
//       this.setState({
//         mainStreamManager: stream,
//       });
//     }
//   }

//   joinSession() {
//     // --- 1) OpenVidu 객체 가져오기 ---
//     this.OV = new OpenVidu();
  
//     // --- 2) 세션 초기화 ---
//     this.setState(
//       { session: this.OV.initSession() },
//       () => {
//         var mySession = this.state.session;
//         this.OV.enableProdMode() // Logger disable하는 함수
//         // --- 3) 세션에서 이벤트가 발생할 때 동작 지정 ---
//         // 새로운 스트림을 받을 때마다...
//         mySession.on("streamCreated", (event) => {
//           // 스트림을 구독하여 받기. 두 번째 매개변수는 정의되지 않음
//           // OpenVidu가 자체적으로 HTML 비디오를 생성하지 않도록 함
//           var subscriber = mySession.subscribe(event.stream, undefined);
//           var subscribers = this.state.subscribers;
//           subscribers.push(subscriber);
  
//           // 새로운 구독자로 상태 업데이트
//           this.setState({
//             subscribers: subscribers,
//           });
//         });
  
//         // 스트림이 파괴될 때마다...
//         mySession.on("streamDestroyed", (event) => {
//           // 'subscribers' 배열에서 스트림 제거
//           this.deleteSubscriber(event.stream.streamManager);
//         });
  
//         // 모든 비동기 예외가 발생할 때마다...
//         mySession.on("exception", (exception) => {
//           console.warn(exception);
//         });

//         // --- 4) 유효한 사용자 토큰으로 세션에 연결 ---
  
//         // OpenVidu 배포에서 토큰 가져오기
//         this.getToken().then((token) => {
//           // 첫 번째 매개변수는 OpenVidu 배포에서 가져온 토큰입니다.
//           // 두 번째 매개변수는 각 사용자가 'streamCreated' 이벤트에서 검색할 수 있는 것입니다
//           // (스트림 연결 데이터의 Stream.connection.data 속성) 및 DOM에 사용자 별명으로 추가됩니다
//           mySession
//             .connect(token, { clientData: this.state.myUserName })
//             .then(async () => {
//               // --- 5) 자신의 카메라 스트림 가져오기 ---
  
//               // 대상 요소로 'undefined'를 전달하여 발행자를 초기화
//               // (OpenVidu에게 비디오를 삽입하지 않도록 함: 직접 관리함)
//               let publisher = await this.OV.initPublisherAsync(undefined, {
//                 audioSource: undefined, // 오디오 소스. 정의되지 않으면 기본 마이크
//                 videoSource: undefined, // 비디오 소스. 정의되지 않으면 기본 웹캠
//                 publishAudio: true, // 오디오를 켜고 끌지 여부
//                 publishVideo: true, // 비디오를 켜고 끌지 여부
//                 resolution: "640x480", // 비디오 해상도
//                 frameRate: 30, // 비디오 프레임 속도
//                 insertMode: "APPEND", // 비디오가 'video-container' 대상 요소에 삽입되는 방식
//                 mirror: false, // 로컬 비디오를 반전할지 여부
//               });
  
//               // --- 6) 스트림 발행 ---
  
//               mySession.publish(publisher);
  
//               // 사용 중인 현재 비디오 디바이스 가져오기
//               var devices = await this.OV.getDevices();
//               var videoDevices = devices.filter(
//                 (device) => device.kind === "videoinput"
//               );
//               var currentVideoDeviceId = publisher.stream
//                 .getMediaStream()
//                 .getVideoTracks()[0]
//                 .getSettings().deviceId;
//               var currentVideoDevice = videoDevices.find(
//                 (device) => device.deviceId === currentVideoDeviceId
//               );
  
//               // 페이지에 자신의 웹캠을 표시하고 발행자 저장
//               this.setState({
//                 currentVideoDevice: currentVideoDevice,
//                 mainStreamManager: publisher,
//                 publisher: publisher,
//               });


//               // data에 내 openvidu id 저장하기 (최초 1회)
//               myGameData.playerId = this.state.myUserName;
//               const count = playerGameDataList.length;
//               const existMyData = false;
//               for(let i = 0; i < count; i++) {
//                 if (playerGameDataList[i] === myGameData.playerId) {
//                   existMyData = true;
//                   break;
//                 }
//               }           
//               if(!existMyData) playerGameDataList.push(myGameData)

//               console.log(`joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`)
//             })
//             .catch((error) => {
//               console.log(
//                 "세션에 연결 중 오류가 발생했습니다:",
//                 error.code,
//                 error.message
//               );
//             });
//         });
//       }
//     );
//   }

//   // sendData() {
//   //   console.log(`sendData()`)
//   //   const signalData = {
//   //     type: 'custom',
//   //     data: JSON.stringify(data)
//   //   };

//   //   // 전송!
//   //   this.state.session.signal(signalData)
//   //     .then(() => { console.log('Signal sent successfully'); })
//   //     .catch((error) => { console.error('Error sending signal:', error); });
//   // }

  

//   leaveSession() {
//     // --- 7) 세션을 떠나기 위해 'disconnect' 메서드를 세션 객체에 호출 ---
//     const mySession = this.state.session;

//     if (mySession) {
//       mySession.disconnect();
//     }

//     // 모든 속성을 초기화합니다...
//     this.OV = null;
//     this.setState({
//       session: undefined,
//       subscribers: [],
//       mySessionId: "SessionA",
//       myUserName: "Participant" + Math.floor(Math.random() * 100),
//       mainStreamManager: undefined,
//       publisher: undefined,
//     });
//   }

//   async switchCamera() {
//     try {
//       // 모든 장치 가져오기
//       const devices = await this.OV.getDevices();
//       var videoDevices = devices.filter(
//         (device) => device.kind === "videoinput"
//       );

//       // 비디오 장치가 1개 이상이면 실행
//       if (videoDevices && videoDevices.length > 1) {
//         // 현재 사용 중인 비디오 디바이스를 제외한 다른 디바이스 찾기
//         var newVideoDevice = videoDevices.filter(
//           (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
//         );

//         // 새로운 비디오 디바이스가 하나 이상이면 실행
//         if (newVideoDevice.length > 0) {
//           // 특정 videoSource로 새로운 발행자 생성
//           // 모바일 기기에서는 기본 및 첫 번째 카메라가 전면 카메라입니다.
//           var newPublisher = this.OV.initPublisher(undefined, {
//             videoSource: newVideoDevice[0].deviceId,
//             publishAudio: true,
//             publishVideo: true,
//             mirror: true,
//           });

//           // 현재 발행 중인 스트림을 중지하고 새로운 발행자로 교체
//           await this.state.session.unpublish(this.state.mainStreamManager);
//           await this.state.session.publish(newPublisher);

//           // 현재 사용 중인 비디오 디바이스 및 발행자를 업데이트
//           this.setState({
//             currentVideoDevice: newVideoDevice[0],
//             mainStreamManager: newPublisher,
//             publisher: newPublisher,
//           });
//         }
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   render() {
//     const mySessionId = this.state.mySessionId;
//     const myUserName = this.state.myUserName;
    
//     return (
//       <div className="container">
//         {/* 세션이 없을 때의 화면 */}
//         {this.state.session === undefined ? (
//           <div id="join">
//             <div id="img-div">
//               <img
//                 src="resources/images/openvidu_grey_bg_transp_cropped.png"
//                 alt="OpenVidu logo"
//               />
//             </div>
//             <div id="join-dialog" className="jumbotron vertical-center">
//               <h1> Join a video session </h1>
//               <form className="form-group" onSubmit={this.joinSession}>
//                 <p>
//                   <label>Participant: </label>
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="userName"
//                     value={myUserName}
//                     onChange={this.handleChangeUserName}
//                     required
//                   />
//                 </p>
//                 <p>
//                   <label> Session: </label>
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="sessionId"
//                     value={mySessionId}
//                     onChange={this.handleChangeSessionId}
//                     required
//                   />
//                 </p>
//                 <p className="text-center">
//                   <input
//                     className="btn btn-lg btn-success"
//                     style={{color:'black'}}
//                     name="commit"
//                     type="submit"
//                     value="JOIN"
//                   />
//                 </p>
//               </form>
//             </div>
//           </div>
//         ) : null}

//         {/* 세션이 있을 때의 화면 */}
//         {this.state.session !== undefined ? (
//           <div id="session">
//             <div id="session-header">
//               <h1 id="session-title">{mySessionId}</h1>
//               <input
//                 className="btn btn-large btn-danger"
//                 type="button"
//                 id="buttonLeaveSession"
//                 onClick={this.leaveSession}
//                 value="Leave session"
//               />
//               <input
//                 className="btn btn-large btn-success"
//                 type="button"
//                 id="buttonSwitchCamera"
//                 onClick={this.switchCamera}
//                 value="Switch Camera"
//               />
//             </div>

//             {/* 메인 비디오 */}
//             {this.state.mainStreamManager !== undefined ? (
//               <div id="main-video" className="col-md-6">
//                 <MyVideoComponent
//                   streamManager={this.state.mainStreamManager}
//                   mySession={this.state.session}
//                 />
//               </div>
//             ) : null}

//             {/* 비디오 컨테이너 */}
//             <div id="video-container" className="col-md-6">
//               {/* 내 비디오 */}
//               {/* {this.state.publisher !== undefined ? (
//                 <div
//                   className="stream-container col-md-6 col-xs-6"
//                   onClick={() =>
//                     this.handleMainVideoStream(this.state.publisher)
//                   }
//                 >
//                   <UserVideoComponent streamManager={this.state.publisher} />
//                 </div>
//               ) : null} */}
//               {/* 다른 참가자들의 비디오 */}
//               {this.state.subscribers.map((sub, i) => (
//                 <div
//                   key={sub.id}
//                   className="stream-container col-md-6 col-xs-6"
//                   onClick={() => this.handleMainVideoStream(sub)}
//                 >
//                   <span>{sub.id}</span>
//                   <UserVideoComponent streamManager={sub} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     );
//   }

//   /**
//    * --------------------------------------------
//    * 어플리케이션 서버에서 토큰 얻기
//    * --------------------------------------------
//    * 아래 메서드들은 세션과 토큰을 어플리케이션 서버에 생성 요청합니다.
//    * 이렇게 함으로써 OpenVidu 배포를 안전하게 유지할 수 있습니다.
//    *
//    * 이 샘플 코드에서는 사용자 제어가 전혀 없습니다. 누구든지 어플리케이션 서버 엔드포인트에 액세스할 수 있습니다!
//    * 실제 프로덕션 환경에서는 어플리케이션 서버가 사용자를 식별하여 엔드포인트에 액세스를 허용해야 합니다.
//    *
//    * OpenVidu를 어플리케이션 서버에 통합하는 자세한 내용은 https://docs.openvidu.io/en/stable/application-server를 참고하세요.
//    */
//   async getToken() {
//     // 세션을 생성하고 해당 세션에 대한 토큰을 얻기 위해 서버에 요청하는 비동기 함수
//     const sessionId = await this.createSession(this.state.mySessionId);
//     return await this.createToken(sessionId);
//   }
  
//   async createSession(sessionId) {
//     // 서버에 새로운 세션을 생성하기 위한 비동기 함수
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + "api/openvidu/sessions",
//       { customSessionId: sessionId },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//     return response.data; // 세션 아이디 반환
//   }
  
//   async createToken(sessionId) {
//     // 서버에 특정 세션에 대한 연결에 대한 토큰을 생성하기 위한 비동기 함수
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + "api/openvidu/sessions/" + sessionId + "/connections",
//       {},
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//     return response.data; // 토큰 반환
//   }
// }

// export default Cam;
























import { useEffect, useState } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import './Cam.css';
import UserVideoComponent from './UserVideoComponent';
import MyVideoComponent from './MyVideoComponent';
import { myGameData, playerGameDataList } from './data.js';

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === 'production' ? '' : 'https://i10e204.p.ssafy.io/';

const Cam = () => {
  const [mySessionId, setMySessionId] = useState('SessionE');
  const [myUserName, setMyUserName] = useState( 'Participant' + Math.floor(Math.random() * 100) );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  let OV, currentVideoDevice;
  useEffect(() => {
    const onbeforeunload = () => {
      leaveSession();
    };
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
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

    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on('streamDestroyed', (event) => {
      // deleteSubscriber(event.stream.streamManager);
    });

    newSession.on('exception', (exception) => {
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
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          });

          newSession.publish(newPublisher);

          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
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

          // console.log(`joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`);
        })
        .catch((error) => {
          console.log('세션에 연결 중 오류가 발생했습니다:', error.code, error.message);
        });
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    setSession(undefined);
    setSubscribers([]);
    setMySessionId('SessionA');
    setMyUserName('Participant' + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  const switchCamera = async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
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
      console.error('Error switching camera:', error);
    }
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + 'api/openvidu/sessions',
        { customSessionId: sessionId },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + `api/openvidu/sessions/${sessionId}/connections`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  };

  return (
    <div className="container">
      {session === undefined ? (
        <div id="join">
          <div id="img-div">
            <img
              src="resources/images/openvidu_grey_bg_transp_cropped.png"
              alt="OpenVidu logo"
            />
          </div>
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1> Join a video session </h1>
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
                />
              </p>
              <p className="text-center">
                <input
                  className="btn btn-lg btn-success"
                  style={{ color: 'black' }}
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
            <div id="main-video" className="col-md-6">
              <MyVideoComponent
                streamManager={mainStreamManager}
                mySession={session}
              />
            </div>
          ) : null}

          <div id="video-container" className="col-md-6">
            {subscribers.map((sub, i) => (
              <div
                key={sub.id}
                className="stream-container col-md-6 col-xs-6"
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
  );
};

export default Cam;