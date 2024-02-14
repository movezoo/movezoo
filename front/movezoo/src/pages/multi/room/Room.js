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
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { myGameData, playerGameDataList } from "../../../components/play/data.js";

import "./Room.css";

import Back from "../../../components/multi/room/Back.js";
import Map from "../../../components/multi/room/Map.js";
import Chat from "../../../components/multi/room/Chat.js";
import Ready from "../../../components/multi/room/Ready.js";
import Start from "../../../components/multi/room/Start.js";
import Select from "../../../components/select/Select";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

const Room = (props) => {
  const {
    setPage,
    session,
    myRoom,
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

  console.log(myRoom)

  const storedUserData = localStorage.getItem('userData');
  const data = (JSON.parse(storedUserData));


  // 게임시작관리(props로 념겨줌)
  const [isGameStart, setIsGameStart] = useState(false);
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  
  console.log(props)
  return (
    <div className="room-container">

      {/* header */}
      <div className="room-header">
        <div>
          <h1 className="room-name">
            {myRoom.roomTitle}[{myRoom.currentUserCount}/{myRoom.maxUserCount}]
          </h1>
        </div>
        <div style={{ position: "absolute", right: "0", bottom: "0" }}>
          <Back leaveSession={leaveSession} />
        </div>
      </div>

      {/*body*/}
      <div className="room-body-card">

        <div className="room-body">

          <div className="room-body-cam">
          
            {mainStreamManager !== undefined ? (
              <div className="room-webCam">
                <MyVideoComponent
                  streamManager={mainStreamManager}
                  mySession={session}
                  />
              </div>
              ) : <h1 className="txtLoading">Loading...</h1>}
            {subscribers.map((sub, i) => (
              <div className="room-webCam">
                <UserVideoComponent className="room-webCam" streamManager={sub} />
              </div>
            ))}
          
          </div>

          <div className="room-option">
            <div className="room-chat">
              <Chat
              session={session}
              connectionId={connectionId}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              />
            </div>
            <div className="room-select">
              <div className="room-map-select">
                <Map />
              </div>
              <div className="room-charact-select-button">
                <Select />
              </div>
              <div className="room-start-select">
                {myRoom.roomMasterId === data.userData.userId?
                <Start setPage={setPage} session={session}/>:<Ready />
                }
                임시시작:<Start setPage={setPage} session={session}/>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
};

export default Room;
