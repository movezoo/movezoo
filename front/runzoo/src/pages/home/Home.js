<<<<<<< HEAD
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>시작 페이지</h1>
      <h2>컴포넌트</h2>
      <p>뒷배경, 스위치, 입력칸</p>
      <ul>
        <h2>연결 페이지</h2>
        <li>
          <Link to="/Main">메인으로</Link>
        </li>
      </ul>
=======
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
>>>>>>> c568d653c5ae5016bf6f86df63896fe54288140d
    </div>
  );
}

export default Home;
