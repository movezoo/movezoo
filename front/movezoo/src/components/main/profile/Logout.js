import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const LogoutModal = ({ isOpen, onRequestClose, onLogout }) => {
  const handleLogout = () => {
    onLogout(); // 로그아웃 기능을 수행하는 함수 호출
    onRequestClose(); // 모달 창 닫기
  };

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
      <div>
        <h3>로그아웃 하시겠습니까?</h3>
        <button onClick={handleLogout}><Link to='/'>예</Link></button>
        <button onClick={onRequestClose}>아니오</button>
      </div>
    </Modal>
  );
};

export default LogoutModal;