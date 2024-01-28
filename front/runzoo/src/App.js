import React, { useState } from 'react';
import Login from './component/main/Login';
import Signup from './component/main/Signup';


function App() {
  const [showSignup, setShowSignup] = useState(false);

  const handleShowSignup = () => {
    setShowSignup(true);
  };
  const handleShowLogin = () => {
    setShowSignup(false);
  };


  return (
    <div className="App">
      <div className='Main'>
        <h1>Main Page</h1>
      </div>

      <div className='Login'>
        {/* 회원가입 버튼 */}
        <button type="button" onClick={handleShowSignup}>
          회원가입
        </button>
        <button type="button" onClick={handleShowLogin}>
          로그인
        </button>

        {/* 회원가입 페이지 또는 로그인 페이지 표시 */}
        {showSignup ? <Signup /> : <Login />}
      </div>
    </div>
  );
}

export default App;
