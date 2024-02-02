import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Ranking.css';

const Ranking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  // const [userLaptime, setUserLaptime] = useState(null);

  useEffect(() => {
    const fetchUserRankings = async (mapNumber) => {
      try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${mapNumber}`);
        const sortedRankings = response.data.sort((a, b) => a.record - b.record);
        const topTenRankings = sortedRankings.slice(0, 10);
        setRankings(topTenRankings);

      } catch (error) {
        console.error('랭킹 정보 요청 실패:', error);
      }
    }

    if (selectedMap !== null) {
      fetchUserRankings(selectedMap);
    }
  }, [selectedMap]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleMapButtonClick = (mapNumber) => {
    setSelectedMap(mapNumber);
  };

  return (
    <div>
      <button onClick={openModal}>랭킹</button>

      <Modal 
        isOpen={isOpen} 
        onRequestClose={closeModal}
        style={{
          content: {
            width: '1000px',
            height: '500px',
            margin: 'auto',
          }
        }}
      >
        <div className='ranking-container'>

          <div className='ranking-header'>
            
            <div className='ranking-header-map'>
              <button className='map-button' onClick={() => handleMapButtonClick(1)}>1번 맵</button>
              <button className='map-button' onClick={() => handleMapButtonClick(2)}>2번 맵</button>
            </div>

            <div className='ranking-header-exit'>
              <button className='exit-button' onClick={closeModal}>닫기</button>
            </div>

          </div>

          <div className='ranking-topTen'>
            {selectedMap !== null && (
              <div>
                {rankings.map((ranking, index) => (
                  <div className='ranking-user' key={index}>
                    <p>{index + 1}위</p>
                    <p>{ranking.nickName}</p>
                    <p>{ranking.record}</p>
                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className='ranking-my'>
          {userLaptime && (
            <div className='ranking-user'>
              <p>사용자 정보</p>
              <p>{userLaptime.nickName}</p>
              <p>{userLaptime.record}</p>
              <hr />
            </div>
          )}
          </div> */}

        </div>
      </Modal>
    </div>
  );
};

export default Ranking;
