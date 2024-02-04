import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

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
        style={{
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
          }
        }}>
        <div>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          <h3>닉네임 변경</h3>
          <input type="text" value={nickname} onChange={handleChangeNickname} />
          <button onClick={handleConfirm}>닉네임 변경</button>
        </div>
      </Modal>

      <Modal 
        isOpen={confirmModal}
        onRequestClose={closeModal}
        style={{
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
          }
        }}>
        <div>
          <h3>정말 닉네임을 변경하시겠습니까?</h3>
          <button onClick={handleNicknameChange}>예</button>
          <button onClick={closeModal}>아니요</button>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeNicknameModal;
