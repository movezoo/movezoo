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
// import { useRecoilState } from 'recoil';
// import { userCoin, nickName as nickNameState, sessionState as userDataState } from '../../components/state/state';

// Modal.setAppElement('#root');

// function Main() {
//   const [volume, setVolume] = React.useState(80);
//   const [nickName, setNickName] = useRecoilState(nickNameState);
//   const [coin, setCoin] = useRecoilState(userCoin);
//   const [userData, setUserData] = useRecoilState(userDataState);
//   const [userimg, setUserimg] = React.useState('');
//   const [loading, setLoading] = React.useState(true);
//   const [isProfileOpen, setIsProfileOpen] = React.useState(false);
//   const [userImage, setUserImage] = React.useState(''); // 사용자 이미지 상태 추가
//   const [userNickname, setUserNickname] = React.useState(''); // 사용자 닉네임 상태 추가

//   const backgroundImage = {
//     backgroundImage: `url('/images/mainbg/sky1.jpg')`,
//     backgroundSize: 'cover',
//   };

//   const openProfileModal = () => {
//     setIsProfileOpen(true);
//   };

//   const closeProfileModal = () => {
//     setIsProfileOpen(false);
//   };

//   // 페이지 로드 시 localStorage에서 userData 상태 로드
//   useEffect(() => {
//     const storedUserData = localStorage.getItem('userData');
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//     }
//   }, [setUserData]);

//   // userData 상태가 변경될 때마다 localStorage에 저장
//   useEffect(() => {
//     localStorage.setItem('userData', JSON.stringify(userData));
//   }, [userData]);
  
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
//         const response = await axios.get('https://i10e204.p.ssafy.io/api/user/103', {})

//         const nickname = response.data.nickname;
//         const userCoin = response.data.coin;
//         const userImg = response.data.profileImgUrl;
        
//         console.log('===========')
//         console.log(userNickname, userCoin, userImg);
        
//         setCoin(userCoin);
//         setNickName(nickname); 
//         setUserImage(userImg); 

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
//     <div className="main-container">

//       {/* 홈으로, 프로필 */}
//       <div className="main-header">

//         <div className="main-header-name">
//           <h1>MoveZoo</h1>
//         </div>

//         <div className="main-header-info">
//           <div className="header-info-user">
//             <div>
//               <h1> {nickName} </h1>
//             </div>
//             <div className="info-user-coin">
//               <AiFillCopyrightCircle className="coinIcon" />
//               <h1> {coin} </h1>
//             </div>
//           </div>

//           <div className="header-info-profile">
//           <img className="profile-image" src={userImage} alt="프로필 이미지" onClick={openProfileModal} />
//           <Profile isProfileOpen={isProfileOpen} isProfileClose={closeProfileModal} setUserImage={setUserImage}/>
//           </div>
//         </div>

//       </div>

//       {/* 카트 미리보기 */}
//       <div className="main-carousel">
//         <Carousel/>
//       </div>
    
//       {/* 네브바 */}
//       <div className="main-navbar">
//         <Navbar setCoin={setCoin}/>
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
import { useRecoilState } from 'recoil';
import { userCoin, nickName as nickNameState, 
        sessionState as userDataState,
        profileImgUrl as profileImgUrlState } from '../../components/state/state';

Modal.setAppElement('#root');

function Main() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [nickName, setNickName] = useRecoilState(nickNameState);
  const [profileImgUrl, setProfileImgUrl] = useRecoilState(profileImgUrlState)
  const [coin, setCoin] = useRecoilState(userCoin);

  const [volume, setVolume] = React.useState(80);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  
  // 페이지 로드 시 localStorage에서 userData 상태 로드
  useEffect(() => {
    console.log(userData)
    const storedUserData = localStorage.getItem('userData');
    console.log(storedUserData)
    if (storedUserData) {
      console.log(storedUserData)

      const data = (JSON.parse(storedUserData));
      
      console.log(data)

      if (data && data.userData) {
        setUserData({ ...data });
        setCoin(data.userData.coin);
        setNickName(data.userData.nickname);
        setProfileImgUrl(data.userData.profileImgUrl);
  
        console.log(data.userData);
        console.log(data.userData.coin);
        console.log(data.userData.nickname);
        console.log(data.userData.userEmail);
      }
      
    }
  }, [setCoin, setNickName, setUserData, setProfileImgUrl]);


  // userData 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
    const storedData = localStorage.getItem('userData');
    console.log('Stored userData in localStorage:', storedData);
  }, [userData]);
  

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
              <h1> {nickName} </h1>
            </div>
            <div className="info-user-coin">
              <AiFillCopyrightCircle className="coinIcon" />
              <h1> {coin} </h1>
            </div>
          </div>

          <div className="header-info-profile">
          <img className="profile-image" src={profileImgUrl} alt="프로필 이미지" onClick={openProfileModal} />
          <Profile isProfileOpen={isProfileOpen} isProfileClose={closeProfileModal}/>
          </div>
        </div>

      </div>

      {/* 카트 미리보기 */}
      <div className="main-carousel">
        <Carousel/>
      </div>
    
      {/* 네브바 */}
      <div className="main-navbar">
        <Navbar setCoin={setCoin}/>
      </div>


    {/* 백그라운드 음악 */}
    <audio id="background-audio" src="/music/background.mp3" autoPlay loop volume={volume / 100} />
  </div>

  );
}

export default Main;