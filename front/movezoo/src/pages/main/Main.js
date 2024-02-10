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

  useEffect(() => {
    console.log('현재 coin 상태:', coin);
  }, [coin]);



  // userData 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
    const storedData = localStorage.getItem('userData');
    console.log('Stored userData in localStorage:', storedData);
  }, [userData]);
  

  return (
    <div className="main-container">

      <div className="left-section">

        <div className="left-header">
          <div className="left-header-name">
            <h1>MoveZoo</h1>
          </div>
        </div>

        <div className="left-carousel">
          <Carousel/>
        </div>

        <div className="main-navbar">
          <Navbar setCoin={setCoin}/>
        </div>

      </div>

      <div className="right-section">

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

        <Link className='navbar-single' to="/single">
          <h1 className='single'>싱글</h1>
        </Link>
        
        <Link className='navbar-multi' to="/multi">
          <h1 className='multi'>멀티</h1>
        </Link>

      </div>


    {/* 백그라운드 음악 */}
    <audio id="background-audio" src="/music/background.mp3" autoPlay loop volume={volume / 100} />
  </div>

  );
}

export default Main;