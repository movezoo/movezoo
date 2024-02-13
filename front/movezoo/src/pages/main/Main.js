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
import {
  userCoin, nickName as nickNameState,
  sessionState as userDataState,
  profileImgUrl as profileImgUrlState
} from '../../components/state/state';

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

  useEffect(() => {
    if (userData.userData === null) {
      axios.get('/api/current-user')
        .then(response => {
          // const userDataFromServer = response.data;
          // console.log(userDataFromServer)
          const newSession = {
            loggedIn: true,
            sessionId: response.data.sessionId,
            userData: response.data, // 받아온 사용자 정보를 userData에 저장
          };
          setUserData(newSession);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userData.UserData, setUserData]);
  
  // userData 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
    const storedData = localStorage.getItem('userData');
    console.log('Stored userData in localStorage:', storedData);
  }, [userData]);

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

  return (
    <div className="main-container">

      <div className="main-header">

        <div className="main-headerName">
          <h1>MoveZoo</h1>
        </div>


        <div className="main-header-info">

          <div className="main-header-navbar">
            <Navbar setCoin={setCoin} />
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


      {/* 백그라운드 음악 */}
      <audio id="background-audio" src="/music/background.mp3" autoPlay loop volume={volume / 100} />
    </div>

  );
}

export default Main;