import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import styles from "./Back.module.css"

const Back = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <button onClick={openModal}>돌아가기</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal} className={styles.goBack}>
        <h1>알림</h1>
        <hr />
        <h3>메인으로 돌아가시겠습니까?</h3>

        <hr />
        <Link to="/Main">
          <button>확인</button>
        </Link>
        <button onClick={closeModal}>취소</button>
      </Modal>
    </div>
  );
};

export default Back;
