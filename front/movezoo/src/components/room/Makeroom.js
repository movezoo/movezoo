import Modal from "react-modal";
import { useState } from "react";
import "./Makeroom.css";

function Makeroom() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <div onClick={openModal}>방 만들기</div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: "500px",
            height: "550px",
            margin: "auto",
            border: "2px solid black",
          },
        }}
      >
        <div className="room-container">
          <div className="room-title">방 만들기</div>
          <div className="room-name">
            <p>방 제목</p>
            <input style={{ width: "70%" }} />
          </div>
          <div className="room-password">
            <p>비밀번호</p>
            <input style={{ width: "70%" }} />
          </div>
          <div className="room-people">인원수</div>
          <div className="room-type">
            <div className="room-option">
              <div className="room-option-selected">개인전</div>
              <div className="room-option-not">팀전</div>
            </div>
            <div className="room-option">
              <div className="room-option-selected">스피드</div>
              <div className="room-option-not">아이템</div>
            </div>
          </div>
          <div className="room-check">
            <div>확인</div>
            <div>취소</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Makeroom;
