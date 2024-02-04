import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        style={{
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
          }
        }}>
        <div>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          <h3>비밀번호 변경</h3>
          <input type="password" value={password} onChange={handleChangePassword} placeholder="새 비밀번호" />
          <input type="password" value={confirmPassword} onChange={handleChangeConfirmPassword} placeholder="비밀번호 확인" />
          <button onClick={handleConfirm}>비밀번호 변경</button>
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
          <h3>정말 비밀번호를 변경하시겠습니까?</h3>
          <button onClick={handlePasswordChange}>예</button>
          <button onClick={closeModal}>아니요</button>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;
