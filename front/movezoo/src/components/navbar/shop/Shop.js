import React, { useState } from 'react';
import Modal from 'react-modal';
import Character from './Character';

const Shop = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>상점</button>

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

        <div>
        <button onClick={closeModal}>닫기</button>
        <h1>상점</h1>
        </div>

        <div>
          <Character/>
        </div>
        
      </Modal>
    </div>
  );
};

export default Shop;
