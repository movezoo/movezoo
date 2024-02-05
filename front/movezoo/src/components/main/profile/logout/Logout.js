import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import './Logout.css';

const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://i10e204.p.ssafy.io/api/logout', {}, {
        withCredentials: true,
      });
      document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // 쿠키 삭제
      navigate('/');  // 홈 화면으로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div>
      <button className='logout-button' onClick={openModal}>로그아웃</button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      className="logoutModal"
      >
        <div className='logout-container'>
          <div className='logout-header'>
            <div className='header-name'>
              <h3>로그아웃 하시겠습니까?</h3>
            </div>
          </div>
          <div className='logout-body'>
            <button className='profile-button' onClick={handleLogout}>예</button>
            <button className='profile-button' onClick={closeModal}>아니요</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LogoutModal;
