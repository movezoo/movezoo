import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const NicknameModal = ({ isOpen, onRequestClose, onSave }) => {
  const [newNickname, setNewNickname] = useState('');

  const handleNicknameChange = (e) => {
    setNewNickname(e.target.value);
  };

  const handleSave = () => {
    // 새 닉네임을 백엔드로 전송
    axios.patch('https://i10e204.p.ssafy.io/api/user/102', { nickname: newNickname })
      .then(response => {
        // 성공적으로 변경되었을 때 처리
        console.log(response.data); // 서버로부터 받은 응답 데이터 출력
        onSave(newNickname); // 수정된 닉네임을 상위 컴포넌트로 전달
      })
      .catch(error => {
        // 에러 발생 시 처리
        console.error(error);
      });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose}
      style={{
        content: {
          width: '300px',
          height: '300px',
          margin: 'auto',
        }
      }}
    >
      <h2>닉네임 변경</h2>
      <input
        type="text"
        value={newNickname}
        onChange={handleNicknameChange}
      />
      <button onClick={handleSave}>저장</button>
      <button onClick={onRequestClose}>뒤로가기</button>
    </Modal>
  );
};

export default NicknameModal;
