import React, { useState } from 'react';
import Modal from 'react-modal';
// import Character from '../../components/navbar/shop/character/Character.js';
import Choose from './Choose.js'
import './Select.css';
import { IoCloseSharp } from "react-icons/io5";

function Select () {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className='select'>
      <div className='select-button-container' onClick={openModal}>
        <p className='selectButton'>캐릭터 선택</p>
      </div>

      <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        <div className='select-container'>

          <div className='select-chracter'>
            <Choose closeModal={closeModal}/>
          </div>
          <div className='shop-exit'>
            <IoCloseSharp className='exit-button' onClick={closeModal} />
          </div>

        </div>

      </Modal>
    </div>
  );
}
export default Select;