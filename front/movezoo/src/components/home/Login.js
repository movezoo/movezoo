import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use FormData to send data as form data
      const formData = new FormData();
      formData.append('useremail', username);
      formData.append('password', password);

      // Send the login request with form data
      const response = await axios.post('http://localhost:5000/api/login/login-proc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // API response handling
      if (response.data.success) {
        setLoggedIn(true);
        navigate('/Main');
      } else {
        alert('id 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('로그인 요청 중 에러 발생:', error);
      alert('로그인 요청 중 에러 발생.');
    }
  };

  return (
    <div>
      {loggedIn ? (
        <p>로그인 성공! 환영합니다, {username}님</p>
      ) : (
        <form>
          <label>
            아이디:
            <input
              type="text"
              name="useremail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleLogin}>
            로그인
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
