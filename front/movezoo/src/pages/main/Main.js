// import { Link } from "react-router-dom";
// import Navbar from "../../components/navbar/Navbar";
// import Carousel from "../../components/main/carousel/Carousel";
// import Profile from "../../components/main/profile/Profile";
// import * as React from 'react';
// import Modal from 'react-modal';
// import './Main.css';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { AiFillCopyrightCircle } from "react-icons/ai";

// Modal.setAppElement('#root');

// function Main() {
//   const [volume, setVolume] = React.useState(80);
//   const [nickname, setNickname] = React.useState('');
//   const [coin, setCoin] = React.useState('');
//   const [userimg, setUserimg] = React.useState('');
//   const [loading, setLoading] = React.useState(true);
//   const [isProfileOpen, setIsProfileOpen] = React.useState(false);

//   const openProfileModal = () => {
//     setIsProfileOpen(true);
//   };

//   const closeProfileModal = () => {
//     setIsProfileOpen(false);
//   };
  
//   useEffect(() => {
//     const fetchUserCharacters = async () => {
//       setLoading(true);
//       try{
//         // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
//         //         withCredentials: true, // 쿠키 허용
//         //       });
//         // const UserId = loginUserId.data;

//         // const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${UserId}`, {})
        

//         // 임시 데이터
//         const response = await axios.get('https://i10e204.p.ssafy.io/api/user/102', {})

//         const userNickname = response.data.nickname;
//         const userCoin = response.data.coin;
//         const userImg = response.data.profileImgUrl;
        
//         console.log('===========')
//         console.log(userNickname, userCoin, userImg);
        

//         setNickname(userNickname); 
//         setCoin(userCoin);
//         setUserimg(userImg)
//       }catch (error) {
//         console.error('캐릭터 정보 요청 실패:', error);
//       }
//       setLoading(false);
//       };
   

//     fetchUserCharacters();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="main-container" >

//       {/* 홈으로, 프로필 */}
//       <div className="main-header">

//         <div className="main-header-name">
//           <h1>MoveZoo</h1>
//         </div>

//         <div className="main-header-info">
//           <div className="header-info-user">
//             <div>
//               <h1> {nickname} </h1>
//             </div>
//             <div className="info-user-coin">
//               <AiFillCopyrightCircle className="coinIcon" />
//               <h1> {coin} </h1>
//             </div>
//           </div>

//           <div className="header-info-profile">
//             <img src={userimg} alt="프로필 이미지" onClick={openProfileModal} />
//             <Profile isProfileOpen={isProfileOpen} isProfileClose={closeProfileModal} />
//           </div>
//         </div>

//       </div>

//       {/* 카트 미리보기 */}
//       <div className="main-carousel">
//         <Carousel/>
//       </div>
    
//       {/* 네브바 */}
//       <div className="main-navbar">
//         <Navbar/>
//       </div>


//     {/* 백그라운드 음악 */}
//     <audio id="background-audio" src="/music/background.mp3" autoPlay loop volume={volume / 100} />
//   </div>

//   );
// }

// export default Main;


// test

import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Carousel from "../../components/main/carousel/Carousel";
import Profile from "../../components/main/profile/Profile";
import * as React from 'react';
import Modal from 'react-modal';
import './Main.css';
import axios from 'axios';
import { useEffect } from 'react';
import { AiFillCopyrightCircle } from "react-icons/ai";

Modal.setAppElement('#root');

function Main() {
  const [volume, setVolume] = React.useState(80);
  const [nickname, setNickname] = React.useState('');
  const [coin, setCoin] = React.useState('');
  const [userimg, setUserimg] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [userImage, setUserImage] = React.useState(''); // 사용자 이미지 상태 추가
  const [userNickname, setUserNickname] = React.useState(''); // 사용자 닉네임 상태 추가

  const backgroundImage = {
    backgroundImage: `url('/images/mainbg/sky1.jpg')`,
    backgroundSize: 'cover',
  };

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };
  
  useEffect(() => {
    const fetchUserCharacters = async () => {
      setLoading(true);
      try{
        const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
                withCredentials: true, // 쿠키 허용
              });
        const UserId = loginUserId.data;

        const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${UserId}`, {})
        

        // 임시 데이터
        // const response = await axios.get('https://i10e204.p.ssafy.io/api/user/2202', {})

        const nickname = response.data.nickname;
        const userCoin = response.data.coin;
        const userImg = response.data.profileImgUrl;
        
        console.log('===========')
        console.log(userNickname, userCoin, userImg);
        

        setCoin(userCoin);
        setUserImage(userImg); // 기존의 setUserimg를 setUserImage로 변경
        setUserNickname(nickname); // 기존의 setNickname을 setUserNickname으로 변경
      }catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
      setLoading(false);
      };
   

    fetchUserCharacters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container">

      {/* 홈으로, 프로필 */}
      <div className="main-header">

        <div className="main-header-name">
          <h1>MoveZoo</h1>
        </div>

        <div className="main-header-info">
          <div className="header-info-user">
            <div>
              <h1> {userNickname} </h1>
            </div>
            <div className="info-user-coin">
              <AiFillCopyrightCircle className="coinIcon" />
              <h1> {coin} </h1>
            </div>
          </div>

          <div className="header-info-profile">
          <img className="profile-image" src={userImage} alt="프로필 이미지" onClick={openProfileModal} />
          <Profile isProfileOpen={isProfileOpen} isProfileClose={closeProfileModal} setUserImage={setUserImage} setUserNickname={setUserNickname} />
          </div>
        </div>

      </div>

      {/* 카트 미리보기 */}
      <div className="main-carousel">
        <Carousel/>
      </div>
    
      {/* 네브바 */}
      <div className="main-navbar">
        <Navbar/>
      </div>


    {/* 백그라운드 음악 */}
    <audio id="background-audio" src="/music/background.mp3" autoPlay loop volume={volume / 100} />
  </div>

  );
}

export default Main;