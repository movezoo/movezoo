// import React, { useState } from "react";
// import "./Map2.css";
// import { AiFillCaretLeft } from "react-icons/ai";
// import { AiFillCaretRight } from "react-icons/ai";

// function Carousel() {
//   const images = [
//     { id: 1, name: 'map1', image: '/images/minimap/n.png' },
//     { id: 2, name: 'map2', image: '/images/minimap/o.png' },
//     "n.png", "o.png"
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((nextIndex) =>
//       nextIndex === images.length - 1 ? 0 : nextIndex + 1
//     );
//   };

//   return (
//     <div className="map-container">

//       <div className="map-header">
//         <div className="map-prev">
//           <AiFillCaretLeft className='map-change-button' onClick={handlePrevious}/>
//         </div>
//         <div className="map-image">
//           <img src={`/minimap/${images[currentIndex]}`} alt="mini-map" />
//         </div>
//         <div className="map-next">
//           <AiFillCaretRight className='map-change-button' onClick={handleNext}/>
//         </div>
//       </div>

//       <div className="map-body">
//         <p className="map-record-name">
//           BEST LAP
//         </p>
//         <p className="best-map-record">
//           00:00:00
//         </p>
        
//       </div>
//     </div>
//   );
// }

// export default Carousel;


// test

import React, { useState, useEffect } from "react";
import "./Map2.css";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import axios from "axios";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLaptime, setUserLaptime] = useState(null);

  const images = [
    { id: 1, name: 'map1', image: '/images/minimap/n.png' },
    { id: 2, name: 'map2', image: '/images/minimap/o.png' }
  ];

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    fetchLapTime(images[newIndex].id); // 이전 맵의 랩타임 요청
  };
  
  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    fetchLapTime(images[newIndex].id); // 다음 맵의 랩타임 요청
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
      console.log(userId) 

      const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);

      console.log(userLaptime.data)
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
          <img src={images[currentIndex].image} alt="mini-map" />
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
          {userLaptime ? userLaptime : '랩타임을 가져오는 중입니다.'}
        </p>
        
      </div>
    </div>
  );
}

export default Carousel;
