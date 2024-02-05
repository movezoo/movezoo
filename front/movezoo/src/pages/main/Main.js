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

  
  useEffect(() => {
    const fetchUserCharacters = async () => {
      try{
        const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
                withCredentials: true, // 쿠키 허용
              });
        const UserId = loginUserId.data;

        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {
        })

        // 임시 데이터
        // const response = await axios.get('https://i10e204.p.ssafy.io/api/user/102', {
        // })
        const userNickname = response.data.nickname;
        const userCoin = response.data.coin;
        
        console.log('===========')
        console.log(userNickname, userCoin);

        setNickname(userNickname); 
        setCoin(userCoin);
      }catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
      }
   

    fetchUserCharacters();
  }, []);

  return (
      <div className="main-container" >

        {/* 홈으로, 프로필 */}
        <div className="main-header">

          <div className="main-header-name">
            <h1>MoveZoo!</h1>
          </div>

          <div className="main-header-info">
            <div className="header-info-user">
              <div>
                <h1> {nickname} </h1>
              </div>
              <div className="info-user-coin">
                <AiFillCopyrightCircle className="coinIcon" />
                <h1> {coin} </h1>
              </div>
            </div>

            <div className="header-info-profile">
              <Profile />
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
          

