import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './NicknameChange.css';
import { IoCloseSharp } from "react-icons/io5";

const ChangeNicknameModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userEmail, setEmail] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  const fetchUser = async () => {
    try {
      const responseLoginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
          withCredentials: true, // 쿠키 허용
        });

      const loginUserId = responseLoginUserId.data;
      
      const loginUserEmail = await axios.get(`https://i10e204.p.ssafy.io/api/user/${loginUserId}`, {
        });

      setEmail(loginUserEmail.data.userEmail);
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmModal(false);
  };

  const handleChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  const handleConfirm = () => {
    setConfirmModal(true);
  };

  const handleNicknameChange = async () => {
    try {
      await axios.patch('https://i10e204.p.ssafy.io/api/user/nickname', {userEmail, nickname}, {
        withCredentials: true,
      });
      
      alert('닉네임 변경에 성공했습니다.');
      closeModal();
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
    }
  };

  return (
    <div>
      <button className='profile-button' onClick={openModal}>닉네임 변경</button>

      <Modal 
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="NicknameChangeModal">

        <div className='NicknameChange-container'>

          <div className='nicknamechange-header'>
            <div className='header-name'>
              <h3>닉네임 변경</h3>
            </div>
            <div className='header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>
          </div>

          <div className='nicknamechange-body'>
            <div className='nickname-change'>
              <input className='nickname-input' type="text" value={nickname} onChange={handleChangeNickname} />
            </div>

            <div className='nickname-change-button'>
              <div className='change-button'>
                <button onClick={handleConfirm}>닉네임 변경</button>
              </div>
            </div>
          </div>

        </div>

      </Modal>

      <Modal 
        isOpen={confirmModal}
        onRequestClose={closeModal}
        className="NicknameChangeModal">
        <div className='NicknameChange-container'>
          <div className='nicknameconfirm-header'>
            <div className='nicknameconfirm-header-name'>
              <h3>정말 닉네임을 변경하시겠습니까?</h3>
            </div>
          </div>
          <div className='nicknameconfirm-body'>
            <button className='profile-button' onClick={handleNicknameChange}>예</button>
            <button className='profile-button' onClick={closeModal}>아니요</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeNicknameModal;
