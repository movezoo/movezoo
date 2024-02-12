import "./Inforoom.css";
import Modal from "react-modal";
import { useRef, useState } from "react";



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
      props.func(props.session) 
      props.setPage(2);
    } else { 
      setPassword("");
    }
  }

  // 방입장 로직
  const enterRoom = () => {
    // 필요한 데이터 : 사용자 ID, sessionID
    // console.log(props.session);
    if (props.secretRoom) {
      openModal();
    } else {
      props.func(props.session) 
      props.setPage(2);
    }
  }

  const images = ["n.png", "o.png"];

  return (
    // state에 필요한 데이터 객체 전달
    <div>
      <div className="inforoom-container" onClick={enterRoom}>
        <div className={props.secretRoom ? "inforoom-head-secret" : "inforoom-head"}>
          <div className="inforoom-title">{props.title}</div>
          <div className="inforoom-user">
            {props.secretRoom ? <img src="/images/signup/m_icon_pass.png" width="25px" /> : null}
            {props.userCount}/{props.userMaxCount}</div>
        </div>
        <div className="inforoom-body">
          <div className="inforoom-mode">
            {props.mode === 0 && <>개인전<br/>스피드</>}
            {props.mode === 1 && <>팀전<br/>스피드</>}
            {props.mode === 2 && <>개인전<br/>아이템</>}
            {props.mode === 3 && <>팀전<br/>아이템</>}
          </div>
          <div className="inforoom-track">
            <img src={`/minimap/${images[props.track]}`} alt="mini-map" />
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
