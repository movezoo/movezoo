import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaUserFriends } from 'react-icons/fa';
import './Friend.css';

const Friend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className='friend'>
      <div className='friend-button-container' onClick={openModal}>
        <FaUserFriends className='friendButton'/>
      </div>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '1000px',
          height: '500px',
          margin: 'auto',
        }
      }}
      >
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
