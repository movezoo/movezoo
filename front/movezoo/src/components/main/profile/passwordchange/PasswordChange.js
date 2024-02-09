import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './PasswordChange.css';
import { IoCloseSharp } from "react-icons/io5";

const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setEmail] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmModal(false);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirm = () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      alert('비밀번호는 8자리 이상이어야 합니다.');
      return;
    }
    
    setConfirmModal(true);
  };

  const handlePasswordChange = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      console.log(userData)

      // 사용자 이메일을 변수에 저장
      const userEmail = userData.userEmail;

      console.log(userEmail)

      await axios.patch('https://i10e204.p.ssafy.io/api/user/password', {userEmail, password}, {
        withCredentials: true,
      });

      alert('비밀번호 변경에 성공했습니다.');
      closeModal();
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
    }
  };

  return (
    <div>
      <button className='profile-button' onClick={openModal}>비밀번호 변경</button>

      <Modal 
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="passwordchangemodal">
        <div className='passwordchange-container'>
          
          <div className='passwordchange-header'>
            <div className='header-name'>
              <h3>비밀번호 변경</h3>
            </div>
            <div className='header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>
          </div>

          <div className='passwordchange-body'>
            <div className='password-change'>
              <input className='passwordchange-input' type="password" value={password} onChange={handleChangePassword} placeholder="새 비밀번호" />
              <input className='passwordchange-input' type="password" value={confirmPassword} onChange={handleChangeConfirmPassword} placeholder="비밀번호 확인" />
            </div>
            <div className='password-change-button'>
              <button className='change-button' onClick={handleConfirm}>비밀번호 변경</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={confirmModal}
        onRequestClose={closeModal}
        className="passwordchangemodal">
        <div className='passwordconfirm-container'>
          <div className='passwordconfirm-header'>
            <h3>정말 비밀번호를 변경하시겠습니까?</h3>
          </div>
          <div className='passwordconfirm-body'>
            <button className='profile-button' onClick={handlePasswordChange}>예</button>
            <button className='profile-button' onClick={closeModal}>아니요</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;
