import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Signup.css';

const Signup = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      document.getElementById('stepUrl').style.display = 'none';
    } else {
      document.getElementById('stepUrl').style.display = 'block';
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    // 비밀번호 길이 체크
    if (newPassword.length < 8) {
      setPasswordError('8자 이상 입력해 주세요.');
    } else {
      setPasswordError('');
    }

    // 비밀번호가 입력될 때마다 비밀번호 상태 업데이트
    setPassword(newPassword);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      alert('회원가입이 되지 않습니다.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://i10e204.p.ssafy.io:5000/users', {
        userEmail: email,
        password: password,
        nickname: nickname
      });

      if (response.data.success) {
        setSignedUp(true);
        onRequestClose();
        navigate('/');
        alert('회원가입 성공!');
      } else {
        alert('회원가입 실패');
        // 실패 시에 입력값 초기화
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNickname('');
      }
    } catch (error) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      console.error('회원가입 요청 중 에러 발생:', error);
      alert('회원가입 중 에러가 발생했습니다.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Signup Modal"
    >
      <div className="wrapper">
        <div id="content">
          <div>
            <h3 className="join_title">
              <label htmlFor="id">이메일</label>
            </h3>
            <span className="box int_id">
              <input
                type="email"
                id="id"
                className="int"
                maxLength="20"
                value={email}
                onChange={handleEmailChange}
              />
              <span id="stepUrl" className="step_url">ex)MoveZoo@gmail.com</span>
            </span>
            <span className="error_next_box"></span>
          </div>

          <div>
            <h3 className="join_title">
              <label htmlFor="pswd1">비밀번호</label>
            </h3>
            <span className="box int_pass">
              <input
                type="password"
                id="pswd1"
                className="int"
                maxLength="20"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                }}
              />
              <span id="alertTxt" style={{ display: passwordError ? 'block' : 'none' }}>{passwordError || '사용불가'}</span>
              <img src="m_icon_pass.png" id="pswd1_img1" className="pswdImg" alt="비밀번호 아이콘" />
            </span>
            <span className="error_next_box">{passwordError}</span>
          </div>

          <div>
            <h3 className="join_title">
              <label htmlFor="pswd2">비밀번호 재확인</label>
            </h3>
            <span className="box int_pass_check">
              <input
                type="password"
                id="pswd2"
                className="int"
                maxLength="20"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
              />
              <img src="m_icon_check_disable.png" id="pswd2_img1" className="pswdImg" alt="비밀번호 확인 아이콘" />
            </span>
            <span className="error_next_box">{password !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}</span>
          </div>

          <div>
            <h3 className="join_title">
              <label htmlFor="name">닉네임</label>
            </h3>
            <span className="box int_name">
              <input
                type="text"
                id="name"
                className="int"
                maxLength="20"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </span>
            <span className="error_next_box"></span>
          </div>
          <div className="btn_area">
            <button type="button" id="btnJoin" onClick={handleSignup}>
              <span>가입하기</span>
            </button>
          </div>
          <div className="btn_area">
            <button type="button" onClick={onRequestClose}>
              <span>닫기</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Signup;
