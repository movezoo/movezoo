<<<<<<< HEAD
// src/Signup.js

import React, { useState } from 'react';
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../../pages/home/Home';
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [signedUp, setSignedUp] = useState(false);
<<<<<<< HEAD
=======
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 얻음
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d

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
<<<<<<< HEAD
    // 이 예제에서는 간단히 가입 성공을 표시합니다.
    alert('회원가입 성공!');
    setSignedUp(true);
=======
    // 이 예제에서는 간단히 가입 성공 시 로그인 페이지로 이동합니다.
    alert('회원가입 성공!');
    setSignedUp(true);

    // 회원가입 성공 시 로그인 페이지로 이동
    navigate(-1);
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
  };

  return (
    <div>
      {signedUp ? (
        <p>회원가입 성공! 환영합니다, {nickname}님</p>
      ) : (
        <form>
          <label>
<<<<<<< HEAD
            이메일:
=======
            이메일 : 
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
<<<<<<< HEAD
            비밀번호:
=======
            비밀번호 : 
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <label>
<<<<<<< HEAD
            비밀번호 확인:
=======
            비밀번호 확인 : 
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <br />
          <label>
<<<<<<< HEAD
            닉네임:
=======
            닉네임 : 
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
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
