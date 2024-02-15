import React, { useState, useEffect } from "react";
import "./Map.css";
// import { AiFillCaretLeft } from "react-icons/ai";
// import { AiFillCaretRight } from "react-icons/ai";
// import axios from "axios";

// 멀티 맵선택
function Map(props) {
  // myRoom === roomInfo = {
  //   roomMode: roomMode,
  //   roomTitle: roomTitle,
  //   roomPassword: secretRoomPassword,
  //   maxRange: maxUserCount,
  //   trackId: mapSelect, // index임 id 아님
  // }
  const { myRoom } = props;
  // myRoom은 roomInfo로 Multi컴포넌트에서 오픈비두 서버통신을 통해 받아온 데이터이다.
  // 따라서 로컬에서는 실행이 되지 않는다.
  const [currentIndex, setCurrentIndex] = useState(myRoom.trackId);
  const [src, setSrc] = useState('');
  // const [userLaptime, setUserLaptime] = useState(null);
  const images = [
    { id: 1, name: 'map1', image: '/images/minimap/map1.png' },
    { id: 2, name: 'map2', image: '/images/minimap/map2.png' }
  ];
  
  
  // const handlePrevious = () => {
  //   const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  //   setCurrentIndex(newIndex);
  //   fetchLapTime(images[newIndex].id); // 이전 맵의 랩타임 요청
  
  //   // 로컬 스토리지에서 userData를 가져옴
  //   const storedUserData = localStorage.getItem('userData');
  //   if (!storedUserData) {
  //     console.error('사용자 정보를 찾을 수 없습니다.');
  //     return;
  //   }
  
  //   // userData를 JSON 형태로 파싱
  //   const userData = JSON.parse(storedUserData);
  
  //   // 선택된 맵의 id를 userData에 추가
  //   userData.selectedMapId = images[newIndex].id;
  
  //   // 수정된 userData를 다시 로컬 스토리지에 저장
  //   localStorage.setItem('userData', JSON.stringify(userData));
  // };
  
  // const handleNext = () => {
  //   const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  //   setCurrentIndex(newIndex);
  //   fetchLapTime(images[newIndex].id); // 다음 맵의 랩타임 요청
  
  //   // 로컬 스토리지에서 userData를 가져옴
  //   const storedUserData = localStorage.getItem('userData');
  //   if (!storedUserData) {
  //     console.error('사용자 정보를 찾을 수 없습니다.');
  //     return;
  //   }
  
  //   // userData를 JSON 형태로 파싱
  //   const userData = JSON.parse(storedUserData);
  
  //   // 선택된 맵의 id를 userData에 추가
  //   userData.selectedMapId = images[newIndex].id;
  
  //   // 수정된 userData를 다시 로컬 스토리지에 저장
  //   localStorage.setItem('userData', JSON.stringify(userData));
  // };

  // const fetchLapTime = async (mapNumber) => {
  //   try {
  //     const storedUserData = localStorage.getItem('userData');
  //       if (!storedUserData) {
  //           throw new Error('사용자 정보를 찾을 수 없습니다.');
  //       }

  //     // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
  //     const userData = JSON.parse(storedUserData);

  //     const userId = userData.userData.userId;
  //     console.log(userId) 

  //     const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);

  //     console.log(userLaptime.data)
  //     setUserLaptime(userLaptime.data.record);
      
  //   } catch (error) {
  //     console.error('랩타임 데이터를 가져오는 중 오류가 발생했습니다:', error);
  //     return null;
  //   }
  // };
  
  useEffect(() => {
    // fetchLapTime(images[currentIndex].id);
    const selectMap = JSON.parse(localStorage.getItem('userData')).selectedMapName
    // console.log(selectMap)
    images.forEach(image => {
      if(image.name === selectMap) setSrc(image.image);
    })
  }, []);

  return (
    <div className="room-map-container">

      <div className="room-map-header">
        <img src={src} alt="mini-map" className="room-map-image" />
      </div>
    </div>
  );
}

export default Map;
