import React from 'react';
import Modal from 'react-modal';

const ImageModal = ({ isOpen, onRequestClose, onSave }) => {
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
      <h2>프로필 사진 변경</h2>
      <input type="file" />
      <button onClick={onSave}>저장</button>
      <button onClick={onRequestClose}>뒤로가기</button>
    </Modal>
  );
};

export default ImageModal;
