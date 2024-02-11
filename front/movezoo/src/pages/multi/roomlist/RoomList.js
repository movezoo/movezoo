import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Makeroom from "../../../components/multi/roomlist/Makeroom";
import Inforoom from "../../../components/multi/roomlist/Inforoom";
import * as React from "react";
import Modal from "react-modal";
import "./RoomList.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { search } from "@tensorflow/tfjs-core/dist/io/composite_array_buffer";

Modal.setAppElement("#root");

function RoomList(props) {
  const [volume, setVolume] = useState(80);
  const [rooms, setRooms] = useState([]);
  const [searchRooms, setSearchRooms] = useState("");
  const onChange = (event) => setSearchRooms(event.target.value);

  const fetchRoomList = async () => {
    try {
      // 임시 데이터
      const response = await axios.get("https://i10e204.p.ssafy.io/api/room", {});
      if (searchRooms !== "") {
        setRooms(response.data.filter((room) => room.roomTitle === searchRooms))
      } else {setRooms(response.data);}
    } catch (error) {
      console.error("방정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  console.log(rooms);

  function enterRoom() {
    props.setPage(2);
  }

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
            <input value={searchRooms} onChange={onChange} placeholder="방 찾기" style={{ width: "80%" }} />
            <button style={{ width: "20%", backgroundColor: "burlywood" }} onClick={fetchRoomList}>
              검색
            </button>
          </div>
          <button className="room-match" onClick={enterRoom}>
            빠른 입장
          </button>
          <button className="room-make">
            <Makeroom setPage={props.setPage} func={props.func} />
          </button>
        </div>
        <div className="room-list">
          {rooms.length === 0 ? (
    <div>로딩중...</div>
  ) : (
    rooms.map((room) => (
      <div className="room-box" key={room.id}>
        <Inforoom
          key={room.id}
          title={room.roomTitle}
          userCount={room.currentUserCount}
          userMaxCount={room.maxUserCount}
          mode={room.roomMode}
          track={room.trackId}
          session={room.roomSessionId}
          setPage={props.setPage}
          func={props.func}
        />
      </div>
    ))
  )}
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

export default RoomList;
