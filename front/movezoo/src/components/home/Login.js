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
      // 백엔드 API로 로그인 요청을 보냅니다.
      const response = await axios.post('https://i10e204.p.ssafy.io/api/login/login-proc', {
        userEmail : username,
        password : password
      }, { withCredentials: true });

      // API 응답에 따라 로그인 상태를 처리합니다.
      if (response.data.success) {
        setLoggedIn(true);
        navigate('/Main')
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 중 에러 발생:', error);
      alert('Id 또는 비밀번호가 틀렸습니다.');
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
