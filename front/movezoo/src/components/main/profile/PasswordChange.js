// NicknameModal.js
import React from 'react';
import Modal from 'react-modal';

const NicknameModal = ({ isOpen, onRequestClose, onSave }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>비밀번호 변경</h2>
      <input></input>
      <input></input>
      <button onClick={onSave}>저장</button>
      <button onClick={onRequestClose}>뒤로가기</button>
    </Modal>
  );
};

export default NicknameModal;
