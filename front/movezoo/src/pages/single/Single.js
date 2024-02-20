import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Map from "../../components/single/Map";
import Start from "../../components/single/Start";
import Select from "../../components/select/Select";
import { gameStartData, myGameData } from "../../components/play/data.js";
import { FaAnglesLeft } from "react-icons/fa6";
import "./Single.css";
import { playGameModeState } from '../../components/state/gameState.js'
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { useNavigate } from "react-router-dom";


function Single() {
  const [loading, setLoading] = useState(true);
  const [playGameMode, setPlayGameMode] = useRecoilState(playGameModeState);
  const navigate = useNavigate();
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
    setPlayGameMode('single');
    gameStartData.mode = 'single';

    // 스토리지 저장
    let storages = JSON.parse(localStorage.getItem('userData'));
    if(!storages.selectMap) storages.selectMap = 'map1';
    
    localStorage.setItem('userData', JSON.stringify(storages));

    gameStartData.selectMap = storages.selectMap;
    gameStartData.selectCharacter = storages.selectedCharacterName;
    myGameData.playerCharacter = storages.selectedCharacterName;
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="single-container">
      
      <Link className="Back" to="/main">
        <FaAnglesLeft className="mr-2" onClick={handleGoBack}/><p>뒤로가기</p>
      </Link>
      
      {/* header */}
      <div className="single-header">
        <h1 className="single-name">Single Play</h1>
      </div>

      {/* body */}
      <div className="single-body-card">
        <div className="single-body">

          <div className="single-body-cam"> {
            loading ? (<h1 className="txtLoading">Loading...</h1>)
                    : (<Webcam
                        className="single-body-webCam"
                        mirrored={true}
                        // onUserMediaError=""
                      />) 
          } </div>
          
          <div className="body-selects">

            <div className="map-select">
              <Map />
            </div>
            <div className="charact-select">
              <Select />
            </div>
            {/* 시작 버튼*/}
            <div className="start-select">
              <Start/>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
export default Single;
