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
    setChatMessages,
    roomGameStart,
  } = props

  // console.log(myRoom)

  const storedUserData = localStorage.getItem('userData');
  const data = (JSON.parse(storedUserData));

  
  // console.log("room info",props.mySessionId)
  return (
    <div className="room-container">
      <div>
        <Back leaveSession={leaveSession} />
      </div>
      

      {/* header */}
      <div className="room-header">
        <div>
          <h1 className="room-name">
            {myRoom.roomTitle}
          </h1>
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
                <Map myRoom={myRoom}/>
              </div>
              <div className="room-charact-select-button">
                <Select />
              </div>
              <div className="room-start-select">
                {myRoom.roomMasterId === data.userData.userId?
                <Start setPage={setPage} session={session} mySessionId={mySessionId} />:<Ready />
                }
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
};

export default Room;
