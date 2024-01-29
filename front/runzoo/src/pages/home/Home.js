import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/home/Login';
import SignUp from '../../components/home/Signup';
import './Home.css';
import GoogleLoginButton from '../../components/home/GoogleLoginButton';

function Home() {
  const navigate = useNavigate();

  // 회원가입 버튼을 누르면 '/signup' 경로로 이동
  const handleSignUpClick = () => {
    navigate('/SignUp');
  };

  return (
    <div className='home-container'>
      <div className='left-section'>
        <h1>프로젝트 소개</h1>
      </div>
      <div className='right-section'>
        <div>
          <Login />
          {/* 회원가입 버튼 추가 */}
          <button onClick={handleSignUpClick}> 회원가입 </button>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Home;
