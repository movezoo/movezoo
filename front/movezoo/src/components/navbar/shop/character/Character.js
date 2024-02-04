import { useState, useEffect } from 'react';
import React from 'react';
import './Character.css';
import axios from 'axios';
import Modal from 'react-modal';

function Character () {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [images, setImages] = useState([]);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const chracterImages = [
        { id: 1, name: '퍼그', image: './shop/1.png' },
        { id: 2, name: '소', image: './shop/2.png' },
        { id: 3, name: '돼지', image: './shop/3.png' },
        { id: 4, name: '양', image: './shop/4.png' },
        { id: 5, name: '말', image: './shop/5.png' },
        { id: 6, name: '라마', image: './shop/6.png' },
        { id: 7, name: '얼룩말', image: './shop/7.png' },
        { id: 8, name: '비밀', image: './shop/8.png' },
      ];
    
  const noCharacterImages = [
    { id: 1, name: '퍼그', image: './shop/no1.png' },
    { id: 2, name: '소', image: './shop/no2.png' },
    { id: 3, name: '돼지', image: './shop/no3.png' },
    { id: 4, name: '양', image: './shop/no4.png' },
    { id: 5, name: '말', image: './shop/no5.png' },
    { id: 6, name: '라마', image: './shop/no6.png' },
    { id: 7, name: '얼룩말', image: './shop/no7.png' },
    { id: 8, name: '비밀', image: './shop/no8.png' },
  ];

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  

  const fetchUserCharacters  = async () => {
    try {
      // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

      // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
      //   withCredentials: true, // 쿠키 허용
      // });
      // const UserId = loginUserId.data;

      // ====================================================

      // 유저 캐릭터 데이터 가져오기
      // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {
      // })

      // 임시 유저 데이터
      const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/102');
      // // console.log(response.data);

      const userCharacterIds = response.data.map(character => character.racerId);
      // console.log(userCharacterIds);

      const userImages = chracterImages.map((image) => {
        if (userCharacterIds.includes(image.id)) {
          return image;
        } else {
          const noCharacterImage = noCharacterImages.find(noImg => noImg.id === image.id);
          return noCharacterImage || image; // 캐릭터가 없는 경우 noCharacterImage로 대체
        }
      });
      setImages(userImages);
      // console.log(userImages);

    } catch (error) {
      console.error('캐릭터 정보 요청 실패:', error);
    }
  }
  
  useEffect(() => {
    fetchUserCharacters ();
  },[]);

  const handleBuyClick = () => {
    setBuyModalOpen(true);
  };
  
  const handleBuyConfirm = async () => {
    try {
      const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        withCredentials: true, // 쿠키 허용
      });
      const userId = loginUserId.data;


      const response = await axios.post(`https://i10e204.p.ssafy.io/api/racer`, {
        userId, racerId: selectedCharacter.id
      }, { withCredentials: true });
  
  
      
      alert('캐릭터를 구매하였습니다.');
      setBuyModalOpen(false);
      // 캐릭터 목록을 다시 불러옵니다.
      fetchUserCharacters();
      
    } catch (error) {
      console.error('캐릭터 구매 실패:', error);
      alert('캐릭터 구매에 실패하였습니다.');
    }
  };

  return (
    <div className='Character-container'>

      <div className='Character-list'>
        {images.map((character) => (
          <div key={character.id} onClick={() => handleCharacterClick(character)}>
            <img className='character-image' src={character.image} alt={character.name} />
          </div>
        ))}
      </div>

      <div className='Character-select'>
        {selectedCharacter && (
            <div className='select-body'>
              <img className='select-image' src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h3 className='image-name'>{selectedCharacter.name}</h3>
              <button className='character-buy-button' onClick={handleBuyClick}>구매하기</button>
            </div>
        )}
      </div>

      <Modal 
        isOpen={buyModalOpen}
        onRequestClose={() => setBuyModalOpen(false)}
        style={{
          content: {
            width: '300px',
            height: '300px',
            margin: 'auto',
          }
        }}>
        <div>
          <h3>정말 이 캐릭터를 구매하시겠습니까?</h3>
          <button onClick={handleBuyConfirm}>예</button>
          <button onClick={() => setBuyModalOpen(false)}>아니요</button>
        </div>
      </Modal>

    </div>
  );
};

export default Character;
