import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './NicknameChange.css';
import { IoCloseSharp } from "react-icons/io5";
import { useRecoilState } from 'recoil';
import { nickName as nickNameState } from '../../../state/state';
import { toast } from 'react-toastify';

const ChangeNicknameModal = () => {
  const [nickname, setNickName] = useRecoilState(nickNameState);
  const [newNickName, setNewNickName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmModal(false);
    setNewNickName('');
  };

  const handleChangeNickname = (e) => {
    setNewNickName(e.target.value);
  };

  const handleConfirm = () => {
    setConfirmModal(true);
  };

  const handleNicknameChange = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      const userData = JSON.parse(storedUserData);
      const userEmail = userData.userData.userEmail;

      // console.log(userEmail, newNickName);

      if (nickname === newNickName) {
        toast.error('현재 닉네임과 같은 닉네임입니다. 다른 닉네임을 입력해주세요.');
        return;
      }

      await axios.patch('https://i10e204.p.ssafy.io/api/user/nickname', {userEmail, nickname: newNickName}, {
        withCredentials: true,
      });

      setNickName(newNickName);
      // console.log(newNickName)
      toast.success('닉네임 변경에 성공했습니다.');
      closeModal();
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
      toast.error('중복되는 닉네임이 있습니다.');
      closeModal();
    }
  };

  return (
    <div>
      <button className='profile-button' onClick={openModal}>닉네임 변경</button>

      <Modal 
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)', 
          },
          content: {
            width: '300px',
            height: '350px',
            margin: 'auto',
            borderRadius: '30px',
          }
        }}
        >

        <div className='NicknameChange-container'>

          <div className='nicknamechange-header'>
            <div className='header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>
          </div>

          <div className='nicknamechange-body'>
            <div className='nicknamechange-body-name'>
              <h3>닉네임 변경</h3>
            </div>
            <div className='nickname-change'>
              <input className='nickname-input' type="text" value={newNickName} onChange={handleChangeNickname} />
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
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: '300px',
            height: '350px',
            margin: 'auto',
            borderRadius: '30px',
          }
        }}
        >
        <div className='Nicknameconfirm-container'>
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