import "./Inforoom.css";
import Modal from "react-modal";
import { useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';


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
      props.enterRoom(props.session) 
      props.setPage(2);
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
      props.enterRoom(props.session) 
      props.setPage(2);
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
          content: {
            width: "500px",
            height: "250px",
            margin: "auto",
            border: "2px solid black",
          },
        }}
      >
        <div className="secretroom-container">
          <div className="secretroom-close" onClick={closeModal}>
            X
          </div>
          <div className="secretroom-title">
            비밀번호를 입력하세요
          </div>
          <div className="secretroom-main">
            <input value={password} onChange={onChange} placeholder="secret이 뭐야?? 비밀..." 
            style={{ width: "80%" }}/>
            <button onClick={checkPassword} 
            style={{ width: "20%", backgroundColor: "burlywood" }}>확인</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Inforoom;
