import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import './Login.css';
import { sessionState } from '../../components/state/state'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useRecoilState(sessionState);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('userEmail', username);
      formData.append('password', password);

      const response = await axios.post('https://i10e204.p.ssafy.io/api/login', formData, {
        withCredentials: true,
      });

      console.log(response);
      console.log("------------------------");
      console.log(response.data);
      console.log("------------------------");
      console.log(response.data.success);
      console.log("------------------------");
      console.log(response.status);

      if (response.status === 200) {
        const newSession = {
          loggedIn: true,
          sessionId: response.data.sessionId,
          userData: response.data.loginUser, // 받아온 사용자 정보를 userData에 저장
        };
        setSession(newSession);

        console.log(newSession)

        await new Promise((resolve) => setTimeout(resolve, 1000));

        navigate('/main');
      } else {
        alert('id 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('로그인에 실패했습니다.', error);
      alert('로그인 실패.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div>
      <h1 className="login">Login</h1>
      <form>
        <label className="id">
          아이디:
          <input
            className="logininput"
            type="text"
            name="userEmail"
            placeholder="User-Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label className="password">
          비밀번호:
          <input
            className="logininput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </label>
        <br />
        <button className="loginbt" type="button" onClick={handleLogin}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;