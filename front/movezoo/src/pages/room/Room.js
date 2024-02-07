import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Makeroom from "../../components/room/Makeroom";
import Inforoom from "../../components/room/Inforoom";
import * as React from "react";
import Modal from "react-modal";
import "./Room.css";
import axios from "axios";
import { useEffect } from "react";

Modal.setAppElement("#root");

function Room() {
  const [volume, setVolume] = React.useState(80);
  const [rooms, setRooms] = React.useState([]);

  const fetchRoomList = async () => {
    try {
      // 임시 데이터
      const response = await axios.get(
        "https://i10e204.p.ssafy.io/api/room",
        {}
      );
      setRooms(response.data);
    } catch (error) {
      console.error("캐릭터 정보 요청 실패:", error);
    }
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  console.log(rooms);

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
            <input style={{ width: "80%" }} />
            <button style={{ width: "20%", backgroundColor: "burlywood" }}>검색</button>
          </div>
          <Link className="room-match" to="/multi">
            <button>빠른 입장</button>
          </Link>
          <button className="room-make">
            <Makeroom />
          </button>
        </div>
        <div className="room-list">
          {rooms.map((room) => (
            <div className="room-box" key={room.id}>
              {
                <Inforoom
                  key={room.id}
                  title={room.roomTitle}
                  userCount={room.currentUserCount}
                  userMaxCount={room.maxUserCount}
                  mode={room.roomMode}
                  track={room.trackId}
                  session={room.roomSessionId}
                />
              }
            </div>
          ))}
        </div>
      </div>

      {/* 네브바 */}
      <div className="room-navbar">
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
