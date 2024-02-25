import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Carousel from "../../components/main/carousel/Carousel";
import Profile from "../../components/main/profile/Profile";
import * as React from 'react';
import Modal from 'react-modal';
import './Main.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { AiFillCopyrightCircle } from "react-icons/ai";
import { useRecoilState } from 'recoil';
import {
  userCoin, nickName as nickNameState,
  sessionState as userDataState,
  profileImgUrl as profileImgUrlState,
  mutedState
} from '../../components/state/state';
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

Modal.setAppElement('#root');

function Main() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [nickName, setNickName] = useRecoilState(nickNameState);
  const [profileImgUrl, setProfileImgUrl] = useRecoilState(profileImgUrlState)
  const [coin, setCoin] = useRecoilState(userCoin);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = React.useState(false);

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setIsMuted(userData.isMuted); 
    }
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      userData.isMuted = isMuted; 
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [isMuted]);

  const handleMute = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);

    const audioElement = document.getElementById("background-audio");
    audioElement.muted = newMuteStatus; 
  };

  useEffect(() => {
    const audio = audioRef.current;

    const storedMuteStatus = JSON.parse(localStorage.getItem('isMuted'));
    if (storedMuteStatus !== null) {
      setIsMuted(storedMuteStatus);
      audio.muted = storedMuteStatus;
    }

    audio.play();
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.muted = isMuted;
  }, [isMuted]);


  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      if (data && data.userData === null) {
        axios.get('/api/current-user')
          .then(response => {
            const newSession = {
              loggedIn: true,
              sessionId: response.data.sessionId,
              userData: response.data,
            };
            setUserData(newSession);
            navigate("/redirect", { state: { url: "/main" } });
          })
          .catch(error => {
            console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
          });
      } else if (data && data.userData) {
        setUserData({ ...data });
        setCoin(data.userData.coin);
        setNickName(data.userData.nickname);
        setProfileImgUrl(data.userData.profileImgUrl);
        
        // console.log(data.userData);
        // console.log(data.userData.coin);
        // console.log(data.userData.nickname);
        // console.log(data.userData.userEmail);
      }
    }
  }, [setCoin, setNickName, setUserData, setProfileImgUrl, navigate]);
  
  useEffect(() => {
    // console.log('현재 coin 상태:', coin);
  }, [coin]);

  // userData 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
    const storedData = localStorage.getItem('userData');
    // console.log('Stored userData in localStorage:', storedData);
  }, [userData]);

  return (
    <div className="main-container">

      <div className="main-header">

        <div className="main-headerName">
          <img src='/images/mainLogo/mainlogo.svg' alt='mainlogo' />
        </div>


        <div className="main-header-info">

          <div className="main-header-navbar">
            <Navbar setCoin={setCoin} />
          </div>


          <div className='main-setting-button-container' onClick={handleMute}> {/* onClick 이벤트를 handleMute로 변경했습니다. */}
            {
              isMuted ? 
                <FaVolumeMute className='settingButton' /> : // 음소거 아이콘이 보입니다.
                <FaVolumeUp className='settingButton' /> // 소리 아이콘이 보입니다.
            }
            <audio ref={audioRef} id="background-audio" src="../music/background.mp3" loop />
          </div>

          <div className="main-header-profile">

            <div className="main-header-userProfile" >
              <img className="profile-image" src={profileImgUrl} alt="프로필 이미지" onClick={openProfileModal} />
              <Profile isProfileOpen={isProfileOpen} isProfileClose={closeProfileModal} />
            </div>

            <div className="main-header-userInfo">
              <div className="main-header-userNickname">
                <h1> {nickName} </h1>
              </div>

              <div className="main-header-userCoin">
                <AiFillCopyrightCircle className="coinIcon" />
                <h1> {coin} </h1>
              </div>

            </div>

          </div>

        </div>

      </div>


      <div className="main-body">

        <div className="main-left-section">

          <div className="main-left-carousel">
            <Carousel />
          </div>

        </div>

        <div className="main-right-section">

          <div className='main-right-single'>
            <Link to="/single">
              <h1>Single</h1>
            </Link>
          </div>

          <div className='main-right-multi'>
            <Link to="/multi">
              <h1>Multi</h1>
            </Link>
          </div>

        </div>

      </div>

    </div>

  );
}

export default Main;