import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Character.css';
import { useRecoilState } from 'recoil';
import { userCoin } from '../../../../components/state/state';
import { userCharacterImages } from '../../../state/state';
import { toast } from 'react-toastify';
import { AiFillCopyrightCircle } from "react-icons/ai";


function Character ({ closeModal }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [images, setImages] = useState([]);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [coin, setCoin] = useRecoilState(userCoin);
  const [characterPrice, setCharacterPrice] = useState(0);
  const [userCharacterImagesState, setUserCharacterImagesState] = useRecoilState(userCharacterImages);


  const chracterImages = [
    { id: 1, name: '시바', image: '/images/shop/shiba.png' },
    { id: 2, name: '당나귀', image: '/images/shop/donkey.png' },
    { id: 3, name: '여우', image: '/images/shop/fox.png' },
    { id: 4, name: '사슴', image: '/images/shop/deer.png' },
    { id: 5, name: '허스키', image: '/images/shop/husky.png' },
    { id: 6, name: '늑대', image: '/images/shop/wolf.png' },
    { id: 7, name: '말', image: '/images/shop/horse.png' },
    { id: 8, name: '순록', image: '/images/shop/stag.png' },
  ];
    
  const noCharacterImages = [
    { id: 1, name: '시바', image: '/images/shop/shibalock.png' },
    { id: 2, name: '당나귀', image: '/images/shop/donkeylock.png' },
    { id: 3, name: '여우', image: '/images/shop/foxlock.png' },
    { id: 4, name: '사슴', image: '/images/shop/deerlock.png' },
    { id: 5, name: '허스키', image: '/images/shop/huskylock.png' },
    { id: 6, name: '늑대', image: '/images/shop/wolflock.png' },
    { id: 7, name: '말', image: '/images/shop/horselock.png' },
    { id: 8, name: '순록', image: '/images/shop/staglock.png' },
  ];

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  

  const fetchUserCharacters  = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      // console.log(userData)

      // 사용자 이메일을 변수에 저장
      const userId = userData.userData.userId;

      // console.log(userId)

      const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${userId}`, {})

      const userCharacterIds = response.data.map(character => character.racerId);

      console.log(userCharacterIds);

      let updateCharacterId = { ...userData };
      updateCharacterId.characterIds = userCharacterIds;
      localStorage.setItem('userData', JSON.stringify(updateCharacterId));

      const userImages = chracterImages.map((image) => {
        if (userCharacterIds.includes(image.id)) {
          return image;
        } else {
          const noCharacterImage = noCharacterImages.find(noImg => noImg.id === image.id);
          return noCharacterImage || image; // 캐릭터가 없는 경우 noCharacterImage로 대체
        }
      });

      console.log(userImages);
      setImages(userImages);

      console.log(userCharacterImagesState);
      
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
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      // console.log(userData)

      const userId = userData.userData.userId;

      // console.log(selectedCharacter.id)

      // console.log(userId)

      // 캐릭터 구매 요청
      const response = await axios.post(`https://i10e204.p.ssafy.io/api/racer`, {
        userId, racerId: selectedCharacter.id
      }, { withCredentials: true });
      
      if (response.status === 200 || response.data.success) { // 성공 응답 조건 확인
        toast.success('캐릭터를 구매하였습니다.');
        setBuyModalOpen(false);
        // 캐릭터 목록을 다시 불러옵니다.
        fetchUserCharacters();
        // 코인 정보를 재조회합니다.ss
        fetchUserCoin();

        // 로컬 스토리지의 사용자 데이터 업데이트
        const updatedUserData = { ...userData, coin: coin };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        
      }
      
    } catch (error) {
      console.error('캐릭터 구매 실패:', error);
      toast.error('Coin이 모자랍니다.');
    }
  };

  const fetchUserCoin = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      // 코인 정보 조회 요청
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userData.userData.userId}`, {
            withCredentials: true
        });

        if (response.status === 200 && response.data) {
            // Recoil 상태 및 로컬 스토리지 업데이트
            const newCoinAmount = response.data.coin;
            setCoin(newCoinAmount); // Recoil 상태 업데이트
           
            let updatedUserData = { ...userData };
            updatedUserData.userData.coin = newCoinAmount;
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

    } catch (error) {
      console.error('유저 코인 정보 요청 실패:', error);
    }
  }


  const fetchCharacterPrice = async (characterId) => {
    try {
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer`);
        const characterData = response.data.find((character) => character.racerId === selectedCharacter.id);
        setCharacterPrice(characterData.racerPrice);
        // console.log(characterData.racerPrice);
    } catch (error) {
        console.error('캐릭터 가격 정보 요청 실패:', error);
    }
  };

  useEffect(() => {
    if (selectedCharacter) {
      fetchCharacterPrice();  // 선택된 캐릭터가 있을 때만 가격 정보 요청
    }
  }, [selectedCharacter]);


  // 캐릭터 선택 시 로컬 스토리지에 저장
  const handleSelectClick = () => {
    if (selectedCharacter) {
      // 'userData'를 로컬 스토리지에서 가져옵니다.
      const userData = JSON.parse(localStorage.getItem('userData'));
  
      // 새로운 값을 추가합니다.
      userData.selectedCharacterId = selectedCharacter.id;
  
      // 변경된 객체를 다시 로컬 스토리지에 저장합니다.
      localStorage.setItem('userData', JSON.stringify(userData));

      toast.success(`'${selectedCharacter.name}'을(를) 선택되었습니다.`);

      closeModal();
    } else {
      toast.error('선택된 캐릭터가 없습니다.');
    }
  };

  return (
    <div className='Character-container'>

      <div className='Character-list'>
        {images.map((character) => (
          <div 
            className={`character-images-wrapper ${selectedCharacter && selectedCharacter.id === character.id ? 'selected' : ''}`} 
            key={character.id} 
            onClick={() => handleCharacterClick(character)}
          >
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
              {/* <div className='body-select-chooseButton'>
                {chracterImages.some(image => image.id === selectedCharacter.id && image.image === selectedCharacter.image) && 
                  <button className='character-choose-button' onClick={handleSelectClick}>선택하기</button>
                }
              </div> */}
              <div className='body-select-buyButton'>
                {noCharacterImages.some(image => image.id === selectedCharacter.id && image.image === selectedCharacter.image) && 
                <button className='character-buy-button' onClick={handleBuyClick}><AiFillCopyrightCircle className="coinIcon" />{characterPrice}</button>}
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
          {/* <div className='buy-text'>
            <p>coin : {characterPrice} </p>
          </div> */}
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
