// src/Login.js

import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // 실제로는 여기에서 백엔드와 통신하여 로그인을 처리해야 합니다.
    // 예를 들어, axios나 fetch를 사용하여 API 호출을 할 수 있습니다.
    // 이 예제에서는 간단히 username과 password가 일치하는지만 확인합니다.
    if (username === 'user' && password === 'password') {
      setLoggedIn(true);
    } else {
      alert('로그인 실패');
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
