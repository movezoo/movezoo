import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import NicknameChange from './NicknameChange';
import PasswordChange from './PasswordChange';
import LogoutModal from './Logout';
import './Profile.css';
import axios from 'axios';


const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUserInfo] = useState(null);

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

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userId}`);
        console.log(response.data);
        const userInfo = response.data;
        setUserInfo(userInfo)
      } catch (error) {
        console.error('유저 정보 요청 실패:', error);
      }

    }

    fetchUserInfo(102);
  }, []);

  return (
    <div>
      <button  onClick={openModal}>
        {user && user.profileImgUrl ? (
          <img src={user.profileImgUrl} alt="프로필 이미지" />) 
          : (<img src="/path/to/default-profile-image.png" alt="기본 프로필 이미지" />
          )}
      </button>

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
          <button className='exit-button' onClick={closeModal}>닫기</button>

          <div>
            <div>
              {user && user.profileImgUrl}
            </div>
            <div>
              <h1>{user && user.nickname}</h1>
            </div>
          </div>

          <div>
            <div>
              <h3>Coin</h3>
            </div>
            <div>
              {user && user.coin}
            </div>
          </div>

          <div>
            <div>
              <button className='profile-button' onClick={openEditNicknameModal}>닉네임 변경</button>
            </div>
            <div>
              <button className='profile-button' onClick={openEditPasswordModal}>비밀번호 변경</button>
            </div>
            <div>
              <button className='profile-button' onClick={() => setIsLogoutModalOpen(true)}>로그아웃</button>
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