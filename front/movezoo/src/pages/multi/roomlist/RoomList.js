import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Makeroom from "../../../components/multi/roomlist/Makeroom";
import Inforoom from "../../../components/multi/roomlist/Inforoom";
import * as React from "react";
import Modal from "react-modal";
import "./RoomList.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { search } from "@tensorflow/tfjs-core/dist/io/composite_array_buffer";
import { toast } from 'react-toastify';
import { FaAnglesLeft } from "react-icons/fa6";

Modal.setAppElement("#root");

function RoomList(props) {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(80);
  const [rooms, setRooms] = useState([]);
  const [searchRooms, setSearchRooms] = useState("");
  const onChange = (event) => setSearchRooms(event.target.value);

  const fetchRoomList = async () => {
    try {
      const response = await axios.get("https://i10e204.p.ssafy.io/api/room", {});
      let filteredRooms = response.data;
      
      if (searchRooms !== "") {
        filteredRooms = filteredRooms.filter(
          (room) => room.roomTitle.includes(searchRooms) && room.roomStatus === false
        );
      } else {
        filteredRooms = filteredRooms.filter((room) => room.roomStatus === false);
      }
      setRooms(filteredRooms);
    } catch (error) {
      console.error("방정보 불러오기 실패:", error);
    }
  };

  const reloadRoomList = () => {
    setSearchRooms("");
    fetchRoomList();
  }

  useEffect(() => {
    fetchRoomList();
  }, [searchRooms]);

 

  
  async function fastEnterRoom() {
    const response = await axios.get(
      "https://i10e204.p.ssafy.io/api/room/fast-enter-room-session",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("fast enter ", response);
    if (response.data == "") {
      toast.error("참가가능한 방이 없음");
      return;
    }

    const fastSessionId = response.data.roomSessionId;
    props.enterRoom(fastSessionId);
    props.setPage(2);
  }

  return (
    <div className="roomlist-container">

      <div className="Back" onClick={() => navigate("/redirect", { state: { url: "/main" } })}>
        <FaAnglesLeft className='mr-2' /><p>뒤로가기</p>
      </div>

      {/* 홈으로, 프로필 */}
      <div className="roomlist-header">
        <div>
          <h1 className="roomlist-header-name">Multi Play!</h1>
        </div>
      </div>

      {/* 방목록 */}
      <div className="roomlist-body">
        <div className="roomlist-info">
          <div className="roomlist-info-choose">
            <div className="roomlist-search">
              <input className="roomlist-search-input" value={searchRooms} onChange={onChange} placeholder="방 찾기" />
            </div>
            <div className="roomlist-search-button" onClick={fetchRoomList}>
              <button>검색</button>
            </div>
            <div className="roomlist-reload" onClick={reloadRoomList}>
              <img className="roomlist-reload-button" src="/images/multibg/reload.png"/>
            </div>
            <div className="roomlist-match" onClick={fastEnterRoom}>
              <button className="roomlist-match-button">
                빠른 입장
              </button>
            </div>
            
                <Makeroom
                  className="roomlist-make"
                  createRoom={props.createRoom}
                  enterRoom={props.enterRoom}
                  setPage={props.setPage}
                  // func={props.func}
                />
              
          </div>



        </div>

        <div className="roomlist-table">
          {rooms.length === 0 ? (<div>로딩중...</div>) : (
            rooms.map((room) => (
              <div className="roomlist-table-box" key={room.id}>
                <Inforoom
                  key={room.id}
                  title={room.roomTitle}
                  userCount={room.currentUserCount}
                  userMaxCount={room.maxUserCount}
                  secretRoom={room.secretRoom}
                  secretRoomPassword={room.secretRoomPassword}
                  mode={room.roomMode}
                  track={room.trackId}
                  session={room.roomSessionId}
                  setPage={props.setPage}
                  // func={props.func}
                  enterRoom={props.enterRoom}
                />
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default RoomList;
