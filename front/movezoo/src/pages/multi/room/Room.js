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
import { myGameData, playerGameDataList } from "../../../components/play/data.js";

import styles from "./Room.module.css";

import Back from "../../../components/multi/room/Back.js";
import Map from "../../../components/multi/room/Map.js";
import Chat from "../../../components/multi/room/Chat.js";
import Ready from "../../../components/multi/room/Ready.js";
import Cam from "../../../components/play/Cam.js";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

const Room = (props) => {
  const {
    setPage,
    session,
    mainStreamManager,
    subscribers,
    setSubscribers,
    publisher,
    mySessionId,
    leaveSession,
    connectionId,
    chatMessage,
    setChatMessage,
    chatMessages,
    setChatMessages
  } = props




  // 게임시작관리(props로 념겨줌)
  const [isGameStart, setIsGameStart] = useState(false);
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  
  console.log(props)
  return (
    <div className={styles.container}>
      {/*왼쪽 영역*/}
      <div className={styles.leftSection}>
        <div className={styles.infoSection}>
          <div className={styles.goBack}>
            <Back leaveSession={props.leaveSession}/>
          </div>
          <h1 style={{ margin: 10 }}>Multi Play</h1>
        </div>
        {/* User 영역 */}
        {/* 메인 비디오 */}
        <div className={styles.userSection}>
          {mainStreamManager !== undefined ? (
            <div id="main-video" className={styles.userBox}>
              <MyVideoComponent
                streamManager={mainStreamManager}
                mySession={session}
              />
            </div>
            ) : "Loading..."}

          {subscribers.map((sub, i) => (
            <div key={sub.id} className={styles.userBox}>
              <span>{sub.id}</span>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
          
          </div>
          
        {/* <div className={styles.userSection}>
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
              </div> */}

              {/* 메인 비디오 */}
              {/* {mainStreamManager !== undefined ? (
                <div id="main-video" className={styles.userBox}>
                  <MyVideoComponent
                    streamManager={mainStreamManager}
                    mySession={session}
                  />
                </div>
              ) : null} */}

              {/* 다른 사용자 비디오 */}
              {/* <div id="video-container" className="col-md-6">
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
        </div> */}
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
          <Chat
            session={session}
            connectionId={connectionId}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        </div>
        {/* 준비 버튼*/}
        <div className={styles.btnReady} onClick={() => { setIsGameStart(true); console.log(`game start!!!`) }}>
          <Ready mySessionId={props.mySessionId} isGameStart={isGameStart} setPage={props.setPage} />
        </div>
      </div>
    </div>
  );
};

export default Room;
