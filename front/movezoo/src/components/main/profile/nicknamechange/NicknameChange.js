import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const ChangeNicknameModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmModal(false);
  };

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const handleConfirm = () => {
    setConfirmModal(true);
  };

  const handleNicknameChange = async () => {
    try {
      await axios.patch('https://i10e204.p.ssafy.io/api/user/nickname', {nickname}, {
        withCredentials: true,
      });
      // 닉네임 변경 요청을 보내는 코드를 작성합니다.
      // 이 부분은 서버의 API에 따라 달라집니다.
      // 예시: await axios.put('/api/nickname', { nickname });

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
          <input type="text" value={nickname} onChange={handleChange} />
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
