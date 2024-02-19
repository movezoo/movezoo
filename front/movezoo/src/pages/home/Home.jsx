// import React, { useState, useEffect } from 'react';
// import Login from '../../components/home/Login';
// import './Home.css';
// import GoogleLoginButton from '../../components/home/GoogleLoginButton';
// import Signup from '../../components/home/Signup';  // Signup 컴포넌트 import

// function Home() {
//   const [isSignupModalOpen, setSignupModalOpen] = useState(false);

//   // 회원가입 버튼을 누르면 모달 열기
//   const handleSignUpClick = () => {
//     setSignupModalOpen(true);
//   };

//   // 모달 닫기
//   const closeSignupModal = () => {
//     setSignupModalOpen(false);
//   };

//   useEffect(() => {
//     // 1초 후에 동영상 재생
//     const timeout = setTimeout(() => {
//       const video = document.getElementById('videoElement');
//       if (video) {
//         video.play();
//       }
//     }, 1000);

//     return () => clearTimeout(timeout); // 컴포넌트가 언마운트되면 타임아웃을 클리어합니다.
//   }, []); // 빈 배열을 전달하여 한 번만 실행되도록 합니다.

//   return (
//     <div className='home-container'>
//       <div className='left-section'>
//         <div className='home-title'>
//           <h1>MoveZoo</h1>
//         </div>
//         {/* 비디오 재생 */}
//         <video id="videoElement" className="video-element" autoPlay muted controls>
//           <source src="/images/homebg/bgracing.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <h1> 소개 </h1>
//       </div>
//       <div className='right-section'>
//         <div>
//           <Login />
//           {/* 회원가입 버튼 추가 */}
//           <button className='signupbt' onClick={handleSignUpClick}> 회원가입 </button>
//           <h3 id='or'> --------  소셜 로그인 --------</h3>
//           <GoogleLoginButton />
//         </div>
//       </div>
//       {/* 회원가입 모달 */}
//       <Signup isOpen={isSignupModalOpen} onRequestClose={closeSignupModal} />
//     </div>
//   );
// }

// export default Home;


import React, { useState, useEffect } from 'react';
import Login from '../../components/home/Login';
import './Home_2.css';
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

  useEffect(() => {
    // 1초 후에 동영상 재생
    const timeout = setTimeout(() => {
      const video = document.getElementById('videoElement');
      if (video) {
        video.play();
      }
    }, 1000);

    return () => clearTimeout(timeout); // 컴포넌트가 언마운트되면 타임아웃을 클리어합니다.
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 합니다.

  return (
    <div className='home-container'>
      <div className='home-title'>
        <img src='/images/mainLogo/mainlogo-art.svg' className='mainlogo' alt='mainlogo'/>
      </div>
      <div className='home-logincontainer'>
        <div className='home-loginbox'>
          <Login />
          {/* 회원가입 버튼 추가 */}
          <GoogleLoginButton />
          <button className='signupbt' onClick={handleSignUpClick}> 회원가입 </button>
        </div>
      </div>
      {/* 회원가입 모달 */}
      <Signup isOpen={isSignupModalOpen} onRequestClose={closeSignupModal} />
    </div>
  );
}

export default Home;
