import { useState, useEffect } from 'react';
import React from 'react';
import './Character.css';
import axios from 'axios';
import Modal from 'react-modal';

function Character ({ setuserCoin }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [images, setImages] = useState([]);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [userCoin, setCoin] = useState('');
  const [characterPrice, setCharacterPrice] = useState(0);


  const chracterImages = [
    { id: 1, name: '퍼그', image: '/images/shop/pug.png' },
    { id: 2, name: '돼지', image: '/images/shop/pig.png' },
    { id: 3, name: '소', image: '/images/shop/cow.png' },
    { id: 4, name: '양', image: '/images/shop/sheep.png' },
    { id: 5, name: '라마', image: '/images/shop/llama.png' },
    { id: 6, name: '말', image: '/images/shop/horse.png' },
    { id: 7, name: '얼룩말', image: '/images/shop/zebra.png' },
    { id: 8, name: '미정', image: '/images/shop/8.png' },
  ];
    
  const noCharacterImages = [
    { id: 1, name: '퍼그', image: '/images/shop/puglock.png' },
    { id: 2, name: '돼지', image: '/images/shop/piglock.png' },
    { id: 3, name: '소', image: '/images/shop/cowlock.png' },
    { id: 4, name: '양', image: '/images/shop/sheeplock.png' },
    { id: 5, name: '라마', image: '/images/shop/llamalock.png' },
    { id: 6, name: '말', image: '/images/shop/horselock.png' },
    { id: 7, name: '얼룩말', image: '/images/shop/zebralock.png' },
    { id: 8, name: '미정', image: '/images/shop/no8.png' },
  ];

  console.log(noCharacterImages);

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

      // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {})

      // 임시 유저 데이터
      const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/2403');

      // console.log(response.data);

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
      
      if (selectedCharacter) {
        const updatedSelectedCharacter = userImages.find(image => image.id === selectedCharacter.id);
        setSelectedCharacter(updatedSelectedCharacter);
      }

      // 코인

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

      // 캐릭터 구매 요청
      const response = await axios.post(`https://i10e204.p.ssafy.io/api/racer`, {
        userId, racerId: selectedCharacter.id
      }, { withCredentials: true });
      
  
      
      alert('캐릭터를 구매하였습니다.');
      setBuyModalOpen(false);
      // 캐릭터 목록을 다시 불러옵니다.
      fetchUserCharacters();
      // 코인 업데이트
      fetchUserCoin();
      
    } catch (error) {
      console.error('캐릭터 구매 실패:', error);
      alert('Coin이 모자랍니다.');
    }
  };

  const fetchUserCoin = async (setuserCoin) => {
    try {
      const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        withCredentials: true, // 쿠키 허용
      });
      const userId = loginUserId.data;
  
      // 유저 코인 불러오기
      // const userCoinResponse = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userId}`, {
      // }, { withCredentials: true });

      // 임시 유저 데이터
      const userCoinResponse = await axios.get(`https://i10e204.p.ssafy.io/api/user/2403`, {
      }, { withCredentials: true });
  
      setCoin(userCoinResponse.data.coin);
    } catch (error) {
      console.error('유저 코인 정보 요청 실패:', error);
    }
  }
  
  useEffect(() => {
    fetchUserCoin(setCoin);
  }, []);


  const fetchCharacterPrice = async (characterId) => {
    try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer`);
        const characterData = response.data.find((character) => character.racerId === selectedCharacter.id);
        setCharacterPrice(characterData.racerPrice);
        console.log(characterData.racerPrice);
    } catch (error) {
        console.error('캐릭터 가격 정보 요청 실패:', error);
    }
  };

  useEffect(() => {
    if (selectedCharacter) {
      fetchCharacterPrice();  // 선택된 캐릭터가 있을 때만 가격 정보 요청
    }
  }, [selectedCharacter]);

  return (
    <div className='Character-container'>

      <div className='Character-list'>
        {images.map((character) => (
          <div className='character-images-wrapper' key={character.id} onClick={() => handleCharacterClick(character)}>
            <img className='character-image' src={character.image} alt={character.name} />
          </div>
        ))}
      </div>

      <div className='Character-select'>
        {selectedCharacter && (
            <div className='select-body'>
              <div className='body-select-image'>
                <img className='select-image' src={selectedCharacter.image} alt={selectedCharacter.name} />
              </div>
              <div className='body-select-name'>
                <p className='image-name'>{selectedCharacter.name}</p>
              </div>
              <div className='body-select-button'>
                {noCharacterImages.some(image => image.id === selectedCharacter.id && image.image === selectedCharacter.image) && 
                <button className='character-buy-button' onClick={handleBuyClick}>구매하기</button>}
              </div>
            </div>
        )}
      </div>

      <Modal 
        isOpen={buyModalOpen}
        onRequestClose={() => setBuyModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.40)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: '300px',
            height: '200px',
            margin: 'auto',
            borderRadius: '30px',
          }
        }}>

        <div className='buy-modal'>
          <div className='buy-modal-name'>
            <p>정말 이 캐릭터를 구매하시겠습니까?</p>
          </div>
          <div className='buy-text'>
            <p>coin : {userCoin} - {characterPrice} </p>
          </div>
          <div className='buy-yes-button'>
            <button className='profile-button' onClick={handleBuyConfirm}>예</button>
          </div>
          <div className='buy-no-button'>
            <button className='profile-button' onClick={() => setBuyModalOpen(false)}>아니요</button>
          </div>
        </div>

      </Modal>

    </div>
  );
};

export default Character;
