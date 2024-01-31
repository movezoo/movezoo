import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Carousel from "../../components/main/carousel/Carousel";
import Profile from "../../components/main/profile/Profile";
import * as React from 'react';
import Modal from 'react-modal';
import './Main.css';

Modal.setAppElement('#root');

function Main() {
  const [volume, setVolume] = React.useState(80);

  return (
    <div className="main-container">

      {/* 홈으로, 프로필 */}
      <div className="main-header">

        <div className="main-home">
          <Link to="/">홈으로</Link>
        </div>

        <div className="main-profile">
          <Profile/>
        </div>

      </div>

      <hr/>

      {/* 카트 미리보기 */}
      <div className="main-carousel">
        <Carousel/>
        <hr/>
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
          

