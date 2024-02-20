import React, { useState, useEffect } from "react";
import "./Map.css";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import axios from "axios";
import { gameStartData } from '../play/data.js'

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLaptime, setUserLaptime] = useState(null);

  const images = [
    { id: 1, name: 'map1', image: '/images/minimap/map1.png' },
    { id: 2, name: 'map2', image: '/images/minimap/map2.png' }
  ];

  const convertToTimeFormat = (laptime) => {
    const minutes = Math.floor(laptime / 60);
    const seconds = Math.floor(laptime % 60);
    const milliseconds = Math.floor((laptime % 1) * 100);

    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    const millisecondsStr = milliseconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}:${millisecondsStr}`;
  };

  useEffect(() => {
    // 로컬 스토리지에서 userData를 가져옴
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      console.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }
  
    // userData를 JSON 형태로 파싱
    const userData = JSON.parse(storedUserData);
  
    // 기본 맵의 id를 userData에 추가
    userData.selectedMapId = images[0].id;
    userData.selectMap = images[0].name;
  
    // 수정된 userData를 다시 로컬 스토리지에 저장
    localStorage.setItem('userData', JSON.stringify(userData));
  
    // 기본 맵의 랩타임 요청
    fetchLapTime(images[0].id); 
  }, []);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    fetchLapTime(images[newIndex].id); // 이전 맵의 랩타임 요청
  
    // 로컬 스토리지에서 userData를 가져옴
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      console.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }
  
    // userData를 JSON 형태로 파싱
    const userData = JSON.parse(storedUserData);
  
    // 선택된 맵의 id를 userData에 추가
    userData.selectedMapId = images[newIndex].id;
    userData.selectMap = images[newIndex].name;
  
    // 수정된 userData를 다시 로컬 스토리지에 저장
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    fetchLapTime(images[newIndex].id); // 다음 맵의 랩타임 요청
  
    // 로컬 스토리지에서 userData를 가져옴
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      console.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }
  
    // userData를 JSON 형태로 파싱
    const userData = JSON.parse(storedUserData);
  
    // 선택된 맵의 id를 userData에 추가
    userData.selectedMapId = images[newIndex].id;
    userData.selectMap = images[newIndex].name;
  
    gameStartData.mode = 'single';
    gameStartData.selectMap = userData.selectMap;
    
    // 수정된 userData를 다시 로컬 스토리지에 저장
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const fetchLapTime = async (mapNumber) => {
    try {
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      const userId = userData.userData.userId;
      // console.log(userId) 

      const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
      

      
      // console.log(userLaptime.data)
      setUserLaptime(userLaptime.data.record);
      
    } catch (error) {
      console.error('랩타임 데이터를 가져오는 중 오류가 발생했습니다:', error);
      return null;
    }

  };
  useEffect(() => {
    fetchLapTime(images[currentIndex].id);
  }, []);

  return (
    <div className="map-container">

      <div className="map-header">
        <div className="map-prev">
          <AiFillCaretLeft className='map-change-button' onClick={handlePrevious}/>
        </div>
        <div className="map-image">
          <img className="map-inner-image" src={images[currentIndex].image} alt="mini-map" />
        </div>
        <div className="map-next">
          <AiFillCaretRight className='map-change-button' onClick={handleNext}/>
        </div>
      </div>

      <div className="map-body">
        <p className="map-record-name">
          BEST LAP
        </p>
        <p className="best-map-record">
          {/* {userLaptime ? userLaptime : 'Loading...'} */}
          {userLaptime ? convertToTimeFormat(userLaptime) : 'No Record'}
        </p>
        
      </div>
    </div>
  );
}

export default Carousel;
