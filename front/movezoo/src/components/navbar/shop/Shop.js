import React, { useState } from 'react';
import Modal from 'react-modal';
import Character from './character/Character.js';
import './Shop.css';
import { AiFillShop } from 'react-icons/ai';
import { IoCloseSharp } from "react-icons/io5";

function Shop () {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


  return (
    <div className='shop'>
      <div className='shop-button-container' onClick={openModal}>
        <AiFillShop  className='shopButton'/>
      </div>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // 투명도를 0.75로 설정한 검은색 배경
        },
        content: {
          width: '1000px',
          height: '550px',
          margin: 'auto',
          borderRadius: '30px',
          backgroundColor: 'rgba(247, 254, 231, 0.8)', 
        }
      }}
      >
        
        <div className="shop-container">

          {/* <div className="shop-header"> 
            <div className='shop-header-name'>
            <h1>상점</h1>
            </div>
          </div> */}

          <div className='shop-chracter'>
            <Character/>
          </div>
          <div className='shop-exit'>
            <IoCloseSharp className='exit-button' onClick={closeModal} />
          </div>
        </div>
        
      </Modal>
    </div>
  );
};

export default Shop;
