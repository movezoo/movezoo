import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Modal from 'react-modal';
import './Signup.css';
import { signUpState } from '../state/state';
import { data } from '../play/data';

const Signup = ({ isOpen, onRequestClose }) => {
  const [signUpData, setSignUpData] = useRecoilState(signUpState);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(newEmail)) {
      setSignUpData((prevSignUpData) => ({ ...prevSignUpData, emailError: '올바른 이메일 형식이 아닙니다.' }));
    } else {
      setSignUpData((prevSignUpData) => ({ ...prevSignUpData, emailError: '' }));
    }

    setSignUpData((prevSignUpData) => ({ ...prevSignUpData, email: newEmail }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    if (!passwordPattern.test(newPassword)) {
      setSignUpData((prevSignUpData) => ({
        ...prevSignUpData,
        passwordError: '8글자 이상 16글자 미만, 대문자와 특수문자가 각각 1개 이상 포함되어야 합니다.',
      }));
      // 사용불가 이미지와 메세지 설정
      document.getElementById('alertTxt').innerText = '사용불가';
      document.getElementById('pswd1_img1').src = '/signup/m_icon_not_use.png';
    } else {
      setSignUpData((prevSignUpData) => ({ ...prevSignUpData, passwordError: '' }));
      // 사용가능 이미지와 메세지 설정
      document.getElementById('alertTxt').innerText = '사용가능';
      document.getElementById('alertTxt').style.color = 'green';
      document.getElementById('pswd1_img1').src = '/signup/m_icon_safe.png';
    }
    setSignUpData((prevSignUpData) => ({ ...prevSignUpData, password: newPassword }));
  };

  const handleSignup = async () => {
    const { email, password, confirmPassword, nickname } = signUpData;

    if (!email || !password || !confirmPassword || !nickname) {
      alert('빈칸이 있습니다.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (signUpData.emailError) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const response = await axios.post('https://i10e204.p.ssafy.io/api/user', {
        userEmail: email,
        password: password,
        nickname: nickname,
      }, { withCredentials: true });

      if (response.data.success) {
        setSignUpData({ email: '', password: '', confirmPassword: '', nickname: '', signedUp: true });
        onRequestClose();
        navigate('/');
        alert('회원가입 성공!');
      } else {
        alert('회원가입 실패');
        setSignUpData({ email: '', password: '', confirmPassword: '', nickname: '', signedUp: false });
      }
    } catch (error) {
      console.error('회원가입 요청 중 에러 발생:', error);
      console.log(data)
      alert(error.response.data.msg);
    }
  };

  const handleCancel = () => {
    onRequestClose();
    setSignUpData({ email: '', password: '', confirmPassword: '', nickname: '', signedUp: false });
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
          width: '550px', // 원하는 크기로 조절
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
                maxLength="30"
                value={signUpData.email}
                onChange={handleEmailChange}
                placeholder='ex)MoveZoo@gmail.com'
              />
            </span>
            <span id="stepUrl" className="step_url"></span>
            <span className="error_next_box" id='emailErrorbox'>{signUpData.emailError}</span>
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
                value={signUpData.password}
                onChange={handlePasswordChange}
              />
              <span id="alertTxt" ></span>
              <img src='/images/signup/m_icon_pass.png' id="pswd1_img1" className="pswdImg" alt="비밀번호 아이콘" />
            </span>
            <span className="error_next_box" id="passwordErrorBox">{signUpData.passwordError}</span>
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
                value={signUpData.confirmPassword}
                onChange={(e) => {
                  setSignUpData({ ...signUpData, confirmPassword: e.target.value, passwordError: '' });
                }}
              />
              <img src={!signUpData.confirmPassword.trim() ? "/signup/m_icon_check_disable.png" : (signUpData.password === signUpData.confirmPassword ? "/signup/m_icon_check_enable.png" : "/signup/m_icon_check_disable.png")} id="pswd2_img1" className="pswdImg" alt="비밀번호 확인 아이콘" />
            </span>
            <span className="error_next_box" >{signUpData.password !== signUpData.confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}</span>
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
                value={signUpData.nickname}
                onChange={(e) => setSignUpData({ ...signUpData, nickname: e.target.value })}
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
