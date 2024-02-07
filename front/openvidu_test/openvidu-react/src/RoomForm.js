import React, { useState } from 'react';
import axios from 'axios';

const RoomForm = () => {
  // 입력된 값을 상태로 관리하기 위한 useState 훅 사용
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // 필요한 다른 폼 입력 필드들을 추가할 수 있습니다.
  });

  // 폼 입력 값이 변경될 때마다 호출되는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼을 제출할 때 백엔드로 데이터를 전송하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    try {
      // Axios를 사용하여 POST 요청 보내기
      const response = await axios.post('/api/submit', formData);
      console.log(response.data); // 백엔드에서 받은 응답 처리
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Enter your username"
        value={formData.username}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
      />
      {/* 필요한 다른 입력 필드들을 추가할 수 있습니다. */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default RoomForm;
