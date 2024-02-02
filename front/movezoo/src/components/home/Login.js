import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // sessionId가 변경될 때마다 실행되는 부분
    if (sessionId) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [sessionId]);

  const handleLogin = async () => {
    try {
      // Use FormData to send data as form data
      const formData = new FormData();
      formData.append('userEmail', username); // or 'useremail' depending on your backend
      formData.append('password', password);

      // Send the login request with form data
      const response = await axios.post('https://i10e204.p.ssafy.io/api/login/login-proc', formData, {
        withCredentials: true, 
      });

      // API response handling
      if (response.data.success) {
        setSessionId(response.data.sessionId); // 세션 식별자 저장
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
      <form>
        <label>
          아이디:
          <input
            type="text"
            name="userEmail"
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
    </div>
  );
};

export default Login;
