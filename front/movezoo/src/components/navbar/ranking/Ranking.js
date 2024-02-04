import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Ranking.css';
import { FaRankingStar } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

const Ranking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [userLaptime, setUserLaptime] = useState(null);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchUserRankings = async (mapNumber) => {
      try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${mapNumber}`);
        const sortedRankings = response.data.sort((a, b) => a.record - b.record);
        const topTenRankings = sortedRankings.slice(0, 10);
        setRankings(topTenRankings);

        const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        withCredentials: true });
        const userId = loginUserId.data;

        // 임시 데이터
        // const userId = 3;

        const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
        setUserLaptime(userLaptime.data);
        // console.log(userLaptime.data);

        const userRank = sortedRankings.findIndex(ranking => ranking.nickName === userLaptime.data.nickName) + 1; // 사용자의 순위를 계산합니다.
        setUserRank(userRank);

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
      <FaRankingStar className='rankingButton' onClick={openModal} />

      <Modal 
        isOpen={isOpen} 
        onRequestClose={closeModal}
        style={{
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
          }
        }}
      >
        <div className='ranking-container'>

          <div className='ranking-header'>
            
            <div className='ranking-header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>

            <div className='ranking-header-map'>
              <button className='map-button' onClick={() => handleMapButtonClick(1)}>1번 맵</button>
              <button className='map-button' onClick={() => handleMapButtonClick(2)}>2번 맵</button>
            </div>

          </div>

          <div className='ranking-body'>
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

            <div className='ranking-my'>
            {userLaptime && (
              <div className='ranking-user'>
                <p>{userRank}위</p>
                <p>{userLaptime.nickName}</p>
                <p>{userLaptime.record}</p>
                <hr />
              </div>
            )}
            </div>
          </div>

        </div>
      </Modal>
    </div>
  );
};

export default Ranking;
