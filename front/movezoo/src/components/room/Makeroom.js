import Modal from "react-modal";
import { useRef, useState, useEffect } from "react";
import "./Makeroom.css";

function Makeroom() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isTeam, setIsTeam] = useState(false);
  const onClickTeam = () => setIsTeam(true);
  const onClickSolo = () => setIsTeam(false);
  const [isItem, setIsItem] = useState(false);
  const onClickItem = () => setIsItem(true);
  const onClickSpeed = () => setIsItem(false);

  const onClickConfirm = () => {
    console.log("asdf")
  }

  return (
    <div>
      <div onClick={openModal}>방 만들기</div>

      <Modal
        isOpen={isOpen}
        // onRequestClose={closeModal}
        style={{
          content: {
            width: "500px",
            height: "550px",
            margin: "auto",
            border: "2px solid black",
          },
        }}
      >
        <div className="makeroom-container">
          <div className="makeroom-close" onClick={closeModal}>X</div>
          <div className="makeroom-title">방 만들기</div>
          <div className="makeroom-name">
            <p>방 제목</p>
            <input style={{ width: "70%", border: "solid black 1px" }} />
          </div>
          <div className="makeroom-password">
            <p>비밀번호</p>
            <input style={{ width: "70%", border: "solid black 1px" }} />
          </div>
          <div className="makeroom-people">인원수</div>
          <div className="makeroom-type">
            <div className="makeroom-option">
              <div
                className={
                  isTeam ? "makeroom-option-not" : "makeroom-option-selected"
                }
                onClick={onClickSolo}
              >
                개인전
              </div>
              <div
                className={
                  isTeam ? "makeroom-option-selected" : "makeroom-option-not"
                }
                onClick={onClickTeam}
              >
                팀전
              </div>
            </div>
            <div className="makeroom-option">
              <div
                className={
                  isItem ? "makeroom-option-not" : "makeroom-option-selected"
                }
                onClick={onClickSpeed}
              >
                스피드
              </div>
              <div
                className={
                  isItem ? "makeroom-option-selected" : "makeroom-option-not"
                }
                onClick={onClickItem}
              >
                아이템
              </div>
            </div>
          </div>
          <div className="makeroom-check">
            <div className="makeroom-confirm" onClick={onClickConfirm}>확인</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Makeroom;
