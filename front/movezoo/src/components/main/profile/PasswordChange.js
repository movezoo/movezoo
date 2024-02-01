import React from 'react';
import Modal from 'react-modal';

const NicknameModal = ({ isOpen, onRequestClose, onSave }) => {
  return (
    <Modal 
    isOpen={isOpen} 
    onRequestClose={onRequestClose}
    style={{
      content: {
        width: '300px',
        height: '300px',
        margin: 'auto',
      }
    }}>
      <h2>비밀번호 변경</h2>
      <input></input>
      <input></input>
      <button onClick={onSave}>저장</button>
      <button onClick={onRequestClose}>뒤로가기</button>
    </Modal>
  );
};

export default NicknameModal;
