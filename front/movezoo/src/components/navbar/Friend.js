import React, { useState } from 'react';
import Modal from 'react-modal';

const Friend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>친구</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <h1>친구</h1>
        <h3>친구목록</h3>
        <hr/>
        <h1>친구 기능 미완</h1>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Friend;
