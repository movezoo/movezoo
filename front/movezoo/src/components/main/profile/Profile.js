import React, { useState } from 'react';
import Modal from 'react-modal';
import NicknameChange from './NicknameChange';
import PasswordChange from './PasswordChange';
import LogoutModal from './Logout';
import './Profile.css';


const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogout = () => {
    // 로그아웃 기능을 수행하는 코드 작성
    // 예를 들어, 세션을 종료하고 홈 화면으로 이동하는 로직을 구현할 수 있습니다.
    // 이 부분은 애플리케이션의 요구사항에 따라 다를 수 있습니다.
  };

  return (
    <div>
      <button onClick={openModal}>프로필</button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '300px',
          height: '300px',
          margin: 'auto',
        }
      }}
      >
        <div>
          <button onClick={closeModal}>닫기</button>

          <div>
            <h1>유저 닉네임</h1>
          </div>

          <div>
            <h3>유저 재화</h3>
          </div>
          
          <hr/>

          <div>
            <div>
              <button on onClick={openEditNicknameModal}>닉네임 변경</button>
            </div>
            <div>
              <button onClick={openEditPasswordModal}>비밀번호 변경</button>
            </div>
            <div>
              <button onClick={() => setIsLogoutModalOpen(true)}>로그아웃</button>
            </div>
          </div>
          
        
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

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />

    </div>
  );
};

export default Profile;