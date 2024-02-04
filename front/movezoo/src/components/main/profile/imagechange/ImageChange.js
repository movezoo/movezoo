import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  

  return (
    <div>
      <button className='profile-button' onClick={openModal}>이미지 변경</button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '500px',
          height: '500px',
          margin: 'auto',
        }
      }}>
        <div>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          <h3>이미지 변경</h3>
          
        </div>
      </Modal>
    </div>
  );
};

export default LogoutModal;