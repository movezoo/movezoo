// src/Signup.js

import React, { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const handleSignup = () => {
    // 입력 필드 중 하나라도 비어있으면 회원가입을 막습니다.
    if (!email || !password || !confirmPassword || !nickname) {
      alert('회원가입이 되지 않습니다.');
      return;
    }

    // 비밀번호와 확인 비밀번호가 일치하는지 확인합니다.
    if (password !== confirmPassword) {
      alert('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 여기에서는 실제로 백엔드와 통신하여 회원가입을 처리해야 합니다.
    // 이 예제에서는 간단히 가입 성공을 표시합니다.
    alert('회원가입 성공!');
    setSignedUp(true);
  };

  return (
    <div>
      {signedUp ? (
        <p>회원가입 성공! 환영합니다, {nickname}님</p>
      ) : (
        <form>
          <label>
            이메일:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <label>
            비밀번호 확인:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <br />
          <label>
            닉네임:
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleSignup}>
            회원가입
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
