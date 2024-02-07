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
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;

    // 이메일 형식 체크
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(newEmail)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      document.getElementById('emailErrorbox').innerText = '올바른 이메일 형식이 아닙니다.';
    } else {
      setEmailError('');
      document.getElementById('emailErrorbox').innerText = '';
    }

    setEmail(newEmail);
    if (newEmail) {
      document.getElementById('stepUrl').style.display = 'none';
    } else {
      document.getElementById('stepUrl').style.display = 'block';
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    // 비밀번호 조건 체크
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordPattern.test(newPassword)) {
      setPasswordError('');
      document.getElementById('alertTxt').innerText = '사용불가';
      document.getElementById('pswd1_img1').src = '/signup/m_icon_not_use.png';
      document.getElementById('passwordErrorBox').innerText = '8글자 이상 16글자 미만, 대문자와 특수문자가 각각 1개 이상 포함되어야 합니다.';
    } else {
      setPasswordError('');
      document.getElementById('alertTxt').innerText = '사용가능';
      document.getElementById('alertTxt').style.color = 'green'
      document.getElementById('pswd1_img1').src = '/signup/m_icon_safe.png';
      document.getElementById('passwordErrorBox').innerText = '';
    }

    // 비밀번호가 입력될 때마다 비밀번호 상태 업데이트
    setPassword(newPassword);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      alert('빈칸이 있습니다.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (emailError) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const response = await axios.post('https://i10e204.p.ssafy.io/api/user', {
        userEmail: email,
        password: password,
        nickname: nickname
      }, { withCredentials: true });

      if (response.data.success) {
        setSignedUp(true);
        onRequestClose();
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNickname('');
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
      alert('회원가입에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    onRequestClose();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      contentLabel="Signup Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '750px', // 원하는 크기로 조절
          height: '80%', // 원하는 크기로 조절
          margin: 'auto',
          borderRadius: '30px'
        },
      }}
    >
      <div className="wrapper">
        <div id="content">
          <h1 className='signup_title'> 회원 가입 </h1>
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
                placeholder='ex)MoveZoo@gmail.com'
              />
            </span>
            <span id="stepUrl" className="step_url"></span>
            <span className="error_next_box" id='emailErrorbox'></span>
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
                onChange={handlePasswordChange}
              />
              <span id="alertTxt" ></span>
              <img src='/images/signup/m_icon_pass.png' id="pswd1_img1" className="pswdImg" alt="비밀번호 아이콘" />
            </span>
            <span className="error_next_box" id="passwordErrorBox"></span>
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
              <img src={!confirmPassword.trim() ? "/signup/m_icon_check_disable.png" : (password === confirmPassword ? "/signup/m_icon_check_enable.png" : "/signup/m_icon_check_disable.png")} id="pswd2_img1" className="pswdImg" alt="비밀번호 확인 아이콘" />
            </span>
            <span className="error_next_box" >{password !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}</span>
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
              <span> 가입하기 </span>
            </button>
            <button type="button" id='btnClose' onClick={handleCancel}>
              <span > 가입취소 </span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Signup;
