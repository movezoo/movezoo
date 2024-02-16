import Modal from "react-modal";
import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import "./Makeroom.css";
import { IoCloseSharp } from "react-icons/io5";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { toast } from 'react-toastify';

function Makeroom(props) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [roomMode, setRoomMode] = useState(0);
  const [isTeam, setIsTeam] = useState(false);
  const onClickTeam = () => {setIsTeam(true); setRoomMode(isItem?3:2)};
  const onClickSolo = () => {setIsTeam(false); setRoomMode(isItem?1:0)};
  const [isItem, setIsItem] = useState(false);
  const onClickItem = () => {setIsItem(true); setRoomMode(isTeam?3:1)};
  const onClickSpeed = () => {setIsItem(false); setRoomMode(isTeam?2:0)};
  const [maxUserCount, setMaxUserCount] = useState(4);
  const onClickPlus = (current) => { if (maxUserCount < 4) {
    setMaxUserCount((current) => current + 1);}};
  const onClickMinus = (current) => { if (maxUserCount > 2) {
    setMaxUserCount((current) => current - 1);}};
  const [mapSelect, setMapSelect] = useState(0);
  const onClickNext = (current) => { 
    mapSelect === 1 ? setMapSelect(0) : setMapSelect(1) 
    console.log("next")
  }
  const onClickPrevious = (current) => { mapSelect === 0 ? setMapSelect(1) : setMapSelect(0) 
    console.log("previous") }

  const images = [
    { id: 1, name: 'map1', image: '/images/minimap/map1.png' },
    { id: 2, name: 'map2', image: '/images/minimap/map2.png' }
  ];

  const roomTitleRef = useRef(null);
  const secretRoomPasswordRef = useRef(null);

  const onClickConfirm = async () => {

    let storage = JSON.parse(localStorage.getItem('userData'));
    storage.selectedMapName = images[mapSelect].name;
    localStorage.setItem('userData', JSON.stringify(storage))

    const roomTitle = roomTitleRef.current.value;
    const secretRoomPassword = secretRoomPasswordRef.current.value;

    if (!roomTitle ) {
      toast.error('방 제목을 입력해주세요.');
      return;
    }

    try{
      var roomInfo = {
        roomMode: roomMode,
        roomTitle: roomTitle,
        roomPassword: secretRoomPassword,
        maxRange: maxUserCount,
        trackId: mapSelect,
      }
      // console.log(roomInfo)

      await props.createRoom(roomInfo)

      // console.log(props.session);
      // props.func(props.session);
      props.setPage(2);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div>
      <div className="roomlist-make" onClick={openModal}>방 만들기</div>

      <Modal
        isOpen={isOpen}
        // onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: "400px",
            height: "460px",
            margin: "auto",
            borderRadius: '30px',
          },
        }}
      >
        <div className="makeroom-container">
          <div className='makeroom-header'>
            <IoCloseSharp className='exit-button' onClick={closeModal} />
          </div>

          <div className="makeroom-body">
            <div className="makeroom-title">
              <p>방 만들기</p>
            </div>

            <div className="makeroom-name">
              <div>
                <p>방 제목</p>
              </div>
              <div>
                <input className="makeroom-name-input" ref={roomTitleRef}/>
              </div>
            </div>

            <div className="makeroom-password">
              <p>비밀번호</p>
              <input className="makeroom-password-input" ref={secretRoomPasswordRef}/>
            </div>

            
          
            <div className="makeroom-people">
              <div>
                <p>인원수</p>
              </div>
              <div className="makeroom-people-btn">
                <div className="makeroom-people-minus" onClick={onClickMinus}>-</div>
                <div className="makeroom-people-num">{maxUserCount}</div>
                <div className="makeroom-people-plus" onClick={onClickPlus}>+</div>
              </div>
            </div>

              
            <div className="makeroom-map">
              <AiFillCaretLeft className="makeroom-map-prev" onClick={onClickPrevious} />
                <img src={images[mapSelect].image} className="makeroom-map-img"/>
              <AiFillCaretRight className="makeroom-map-next" onClick={onClickNext}/>
            </div>

            
            
            <div className="makeroom-check">
              <div className="makeroom-confirm" onClick={onClickConfirm}>
                <p>확인</p>
              </div>
            </div>

          </div>

        </div>
      </Modal>
    </div>
  );
}

export default Makeroom;
