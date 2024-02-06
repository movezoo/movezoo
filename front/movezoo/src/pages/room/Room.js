import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Makeroom from "../../components/room/Makeroom";
import * as React from "react";
import Modal from "react-modal";
import "./Room.css";
import axios from "axios";
import { useEffect } from "react";

Modal.setAppElement("#root");

function Room() {
  const [volume, setVolume] = React.useState(80);
  const [nickname, setNickname] = React.useState("");
  const [coin, setCoin] = React.useState("");

  return (
    <div className="room-container">
      {/* 홈으로, 프로필 */}
      <div className="room-header">
        <div className="room-header-name">
          <h1>MoveZoo!</h1>
        </div>
      </div>

      {/* 방목록 */}
      <div className="room-main">
        <div className="room-info">
          <div className="room-search">
            <input />
            <button>검색</button>
          </div>
          <Link className="room-match" to="/multi">
            <button>빠른 입장</button>
          </Link>
          <button className="room-make">
            <Makeroom />
          </button>
        </div>
        <div className="room-list">
          <div className="room-box">1</div>
          <div className="room-box">1</div>
          <div className="room-box">1</div>
          <div className="room-box">1</div>
          <div className="room-box">1</div>
        </div>
      </div>

      {/* 네브바 */}
      <div className="main-navbar">
        <Navbar />
      </div>

      {/* 백그라운드 음악 */}
      <audio
        id="background-audio"
        src="/music/background.mp3"
        autoPlay
        loop
        volume={volume / 100}
      />
    </div>
  );
}

export default Room;
