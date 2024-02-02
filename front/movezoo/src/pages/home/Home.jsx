import React, { useState } from 'react';
import Login from '../../components/home/Login';
import './Home.css';
import GoogleLoginButton from '../../components/home/GoogleLoginButton';
import Signup from '../../components/home/Signup';  // Signup 컴포넌트 import

function Home() {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  // 회원가입 버튼을 누르면 모달 열기
  const handleSignUpClick = () => {
    setSignupModalOpen(true);
  };

  // 모달 닫기
  const closeSignupModal = () => {
    setSignupModalOpen(false);
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

      {/* 회원가입 모달 */}
      <Signup isOpen={isSignupModalOpen} onRequestClose={closeSignupModal} />
    </div>
  );
}

export default Home;
