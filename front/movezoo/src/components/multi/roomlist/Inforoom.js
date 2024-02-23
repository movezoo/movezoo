import "./Inforoom.css";
import Modal from "react-modal";
import { useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";


function Inforoom( props ) {
  // 참고: [React Router Document](https://reactrouter.com/en/main/components/link)

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [password, setPassword] = useState("");
  const onChange = (event) => setPassword(event.target.value);

  // 비밀번호 체크
  const checkPassword = () => {
    if (props.secretRoomPassword === password) {
      // 방을 만들고 맵선택후 자동입장시 스토리지 저장
      const images = [
        { id: 1, name: 'map1', image: '/images/minimap/map1.png' },
        { id: 2, name: 'map2', image: '/images/minimap/map2.png' }
      ];

      let storages = JSON.parse(localStorage.getItem('userData'));  
      storages.selectedMapName = images[props.track].name; // 맵이름 저장
      localStorage.setItem('userData', JSON.stringify(storages));
      
      props.enterRoom(props.session) 
    } else { 
      setPassword("");
    }
  }

  // 방입장 로직
  const enterRoom = () => {
    // 필요한 데이터 : 사용자 ID, sessionID
    // console.log(props.session);
    if(props.userCount >= props.userMaxCount) {
      toast.error("사람이 모두 찼습니다.");
      return;
    }
    if (props.secretRoom) {
      openModal();
    } else {
      // 방을 만들고 맵선택후 자동입장시 스토리지 저장
      const images = [
        { id: 1, name: 'map1', image: '/images/minimap/map1.png' },
        { id: 2, name: 'map2', image: '/images/minimap/map2.png' }
      ];

      // console.log(`props.track : ${props.track}`);
      let storages = JSON.parse(localStorage.getItem('userData'));  
      storages.selectedMapName = images[props.track].name; // 맵이름 저장
      localStorage.setItem('userData', JSON.stringify(storages));

      props.enterRoom(props.session) 
    }
  }

  const images = ["map1.png", "map2.png"];

  return (
    // state에 필요한 데이터 객체 전달
    <div>
      <div className="inforoom-container" onClick={enterRoom}>

        <div className={props.secretRoom ? "inforoom-head-secret" : "inforoom-head"}>
          <div className="inforoom-title">
            {props.title}
          </div>
          <div className="inforoom-room-state">
            <div className="inforoom-secret-icon">
              {props.secretRoom ? <FaLock /> : null}
            </div>
            <div className="inforoom-user-count">
              {props.userCount}/{props.userMaxCount}
            </div>
          </div>
        </div>

        <div className="inforoom-body">
          <div className="inforoom-track">
            <img className="inforoom-body-img" src={`/images/minimap/${images[props.track]}`} alt="mini-map" />
          </div>
          <div className="inforoom-mode">
            {props.mode === 0 && <>개인전<br/>스피드</>}
            {props.mode === 1 && <>팀전<br/>스피드</>}
            {props.mode === 2 && <>개인전<br/>아이템</>}
            {props.mode === 3 && <>팀전<br/>아이템</>}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        // onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: "350px",
            height: "250px",
            margin: "auto",
            borderRadius: '30px',
          },
        }}
      >
        <div className="secretroom-container">
          
          <div className='header-exit'>
            <IoCloseSharp className='exit-button' onClick={closeModal} />
          </div>

          <div className="secretroom-title">
            비밀번호를 입력하세요
          </div>
          <div className="secretroom-main">
            <input className="secretroom-main-input" value={password} onChange={onChange} placeholder="password" />
            <button className="secretroom-main-button" onClick={checkPassword}>확인</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Inforoom;
