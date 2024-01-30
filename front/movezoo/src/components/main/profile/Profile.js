import React, { useState } from 'react';
import Modal from 'react-modal';
import NicknameChange from './NicknameChange';
import PasswordChange from './PasswordChange';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openEditNicknameModal = () => {
    setIsEditNicknameOpen(true);
  };

  const closeEditNicknameModal = () => {
    setIsEditNicknameOpen(false);
  };

  const openEditPasswordModal = () => {
    setIsEditPasswordOpen(true);
  };

  const closeEditPasswordModal = () => {
    setIsEditPasswordOpen(false);
  };

  // 닉네임 변경 
  const saveNewNickname = () => {
    closeEditNicknameModal();
  };

  // 비밀번호 변경
  const saveNewPassword = () => {
    closeEditPasswordModal();
  };

  return (
    <div>
      <button onClick={openModal}>프로필</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <div>

          <div>
            <h1>유저 닉네임</h1>
          </div>

          <div>
            <h3>유저 재화</h3>
          </div>
          
        <button onClick={openEditNicknameModal}>닉네임 변경</button>
        <button onClick={openEditPasswordModal}>비밀번호 변경</button>
        <button>
          <Link to="/">로그아웃</Link>
        </button>
        <hr/>
        <button onClick={closeModal}>닫기</button>
        
        </div>
      </Modal>

      <NicknameChange
        isOpen={isEditNicknameOpen}
        onRequestClose={closeEditNicknameModal}
        onSave={saveNewNickname}
      />

      <PasswordChange
        isOpen={isEditPasswordOpen}
        onRequestClose={closeEditPasswordModal}
        onSave={saveNewPassword}
      />

    </div>
  );
};

export default Profile;



