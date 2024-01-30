// import React, { useState } from 'react';
// import Modal from 'react-modal';

// const Ranking = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => {
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <button onClick={openModal}>랭킹</button>

//       <Modal isOpen={isOpen} onRequestClose={closeModal}>
//         <h1>랭킹</h1>
//         <h3>맵</h3>
        
//         <hr/>
//         <button onClick={closeModal}>닫기</button>
//       </Modal>
//     </div>
//   );
// };

// export default Ranking;



import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const Ranking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    // 백엔드에서 유저 데이터를 받아오는 함수 호출
    fetchRankings();
  }, []);

  const fetchRankings = () => {
    // 백엔드 API로부터 랭킹 데이터를 받아오는 로직 구현
    // 예시로 랭킹 데이터를 더미 데이터로 설정
    const dummyRankings = [
      { rank: 1, nickname: 'User1', lapTime: '01:23:45' },
      { rank: 2, nickname: 'User2', lapTime: '01:30:00' },
      { rank: 3, nickname: 'User3', lapTime: '01:35:20' },
      // ... 상위 10명의 랭킹 데이터
    ];

    // 받아온 랭킹 데이터를 상태에 설정
    setRankings(dummyRankings);

    // 나의 등수를 찾아서 상태에 설정
    const myRankData = dummyRankings.find((data) => data.nickname === 'MyNickname');
    if (myRankData) {
      setMyRank(myRankData.rank);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>랭킹</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <h1>랭킹</h1>
        <table>
          <thead>
            <tr>
              <th>등수</th>
              <th>닉네임</th>
              <th>랩타임</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((data) => (
              <tr key={data.rank}>
                <td>{data.rank}</td>
                <td>{data.nickname}</td>
                <td>{data.lapTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {myRank && (
          <p>나의 등수: {myRank}</p>
        )}
        <hr />
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Ranking;
