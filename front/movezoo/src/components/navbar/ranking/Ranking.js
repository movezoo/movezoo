import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Ranking.css';
import { FaRankingStar } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

const Ranking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [selectedMap, setSelectedMap] = useState(1);
  const [userLaptime, setUserLaptime] = useState(null);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchUserRankings = async (mapNumber) => {
      try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${mapNumber}`);
        const sortedRankings = response.data.sort((a, b) => a.record - b.record);
        const topTenRankings = sortedRankings.slice(0, 10);
        setRankings(topTenRankings);

        
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

        const userData = JSON.parse(storedUserData);
        

        const userId = userData.userData.userId;

        console.log(userId);
        console.log(mapNumber);

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
    <div className='ranking'>
      <div className='ranking-button-container'  onClick={openModal} >
        <FaRankingStar className='rankingButton'/>
      </div>

      <Modal 
        isOpen={isOpen} 
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
            borderRadius: '30px',
            backgroundColor: 'rgba(247, 254, 231, 0.8)',
          }
        }}
      >
        <div className='ranking-container'>

          <div className='ranking-header'>
            
            <div className='ranking-header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>

            <div className='ranking-header-map'>
              <button className='ranking-map-button' onClick={() => handleMapButtonClick(1)}>1번 맵</button>
              <button className='ranking-map-button' onClick={() => handleMapButtonClick(2)}>2번 맵</button>
            </div>

          </div>

          <div className='ranking-body'>
            <div className='ranking-topTen'>
              {selectedMap !== null && (
                <div>
                  {rankings.map((ranking, index) => (
                    <div className='ranking-user' key={index}>
                      <p className='w-40'>{index + 1}위</p>
                      <p className='w-80'>{ranking.nickName}</p>
                      <p className='w-40'>{ranking.record}</p>
                    </div>
                  ))}

                </div>
              )}
            </div>

            <hr className='ranking-line'/>
            
            <div className='ranking-my'>
            {userLaptime && (
              <div className='ranking-user'>
                <p className='w-40'>{userRank}위</p>
                <p className='w-80'>{userLaptime.nickName}</p>
                <p className='w-40'>{userLaptime.record}</p>
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
