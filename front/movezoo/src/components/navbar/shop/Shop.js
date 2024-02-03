import React, { useState } from 'react';
import Modal from 'react-modal';
import Character from './character/Character.js';
import './Shop.css';

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
        
        <div className="shop-container">

          <div className="shop-header">
            <div className='shop-header-name'>
              <h1>상점</h1>
            </div>
            <div className='shop-header-exit'>
              <button className='exit-button' onClick={closeModal}>닫기</button>
            </div>
          </div>

          <div className='shop-chracter'>
            <Character/>
          </div>
        </div>
        
      </Modal>
    </div>
  );
};

export default Shop;
