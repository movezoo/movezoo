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
    <div>
      <div>
        <AiFillShop className='shopButton' onClick={openModal}/>
      </div>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '1000px',
          height: '500px',
          margin: 'auto',
          border: '2px solid black',
        }
      }}
      >
        
        <div className="shop-container">

          <div className="shop-header">
            <div className='shop-header-name'>
              <h1>상점</h1>
            </div>
            <div className='shop-header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
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
