import React, { useEffect, useState } from 'react';
import './Carousel.css';
import axios from 'axios';
import Shop from '../../navbar/shop/Shop';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userCharacterImages } from '../../state/state';


function Carousel() {
  const initialImages  = [
    { id: 1, fileName: 'shiba', name: '시바', image: '/images/shop/shiba.png' },
    { id: 2, fileName: 'donkey', name: '당나귀', image: '/images/shop/donkey.png' },
    { id: 3, fileName: 'fox', name: '여우', image: '/images/shop/fox.png' },
    { id: 4, fileName: 'deer', name: '사슴', image: '/images/shop/deer.png' },
    { id: 5, fileName: 'husky', name: '허스키', image: '/images/shop/husky.png' },
    { id: 6, fileName: 'wolf', name: '늑대', image: '/images/shop/wolf.png' },
    { id: 7, fileName: 'horse', name: '말', image: '/images/shop/horse.png' },
    { id: 8, fileName: 'stag', name: '순록', image: '/images/shop/stag.png' },
  ];

  const [images, setImages] = useState([]);
  const [nextIndex, setNextIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('right');
  const [userCharacterImagesState, setUserCharacterImagesState] = useRecoilState(userCharacterImages);

  console.log(userCharacterImagesState);
  const navigate = useNavigate();

  const openStoreModal = () => {
    navigate('/shop'); // '/shop'은 상점 페이지의 경로입니다.
  };
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      return 0; // 로컬 스토리지에 userData가 없으면 기본값 0을 사용
    }
    const userData = JSON.parse(storedUserData);
    const selectedCharacterId = userData.selectedCharacterId;
    if (selectedCharacterId === undefined) {
      return 0; // selectedCharacterId가 설정되지 않았으면 기본값 0을 사용
    }
    const index = initialImages.findIndex(image => image.id === selectedCharacterId);
    return index === -1 ? 0 : index; // selectedCharacterId에 해당하는 이미지가 없으면 기본값 0을 사용
  });
  
  const handlePrevious = () => {
    if (images.length <= 1) return; // 이미지가 하나 또는 없을 경우 아무 작업도 수행하지 않음
    setNextIndex((prevIndex) => {
      let newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      const originalIndex = newIndex;
      while (!images[newIndex]) {
        console.log(newIndex); // newIndex의 변화를 추적
        newIndex = newIndex <= 0 ? images.length - 1 : newIndex - 1; // newIndex가 0보다 작아지지 않도록 수정
        if (newIndex === originalIndex) break; // 모든 이미지가 유효하지 않은 경우 루프를 빠져나옴
      }
      return newIndex;
    });
    setAnimationDirection('right');
  };
  
  const handleNext = () => {
    if (images.length <= 1) return; // 이미지가 하나 또는 없을 경우 아무 작업도 수행하지 않음
    setNextIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setAnimationDirection('left');
  };

  useEffect(() => {
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
    }
  }, [nextIndex]);

  useEffect(() => {
    if (currentIndex !== null && images[currentIndex]) {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
      
      const userData = JSON.parse(storedUserData);
      userData.selectedCharacterId = images[currentIndex].id;
      userData.selectedCharacterName = images[currentIndex].fileName;
      localStorage.setItem('userData', JSON.stringify(userData));
    }
}, [currentIndex, images]);

  useEffect(() => {
    const fetchUserCharacters = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        
        const userData = JSON.parse(storedUserData);
        
        
        const userId = userData.userData.userId;
        
        // console.log(userId);
        
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${userId}`, {})

        // console.log('===========')
        // console.log(response.data);
        const userCharacterIds = response.data.map(character => character.racerId);
        const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
        setImages(userImages);
      } catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
    };

    fetchUserCharacters();
  }, []);

  useEffect(() => {
    const fetchUserCharacters = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        
        const userData = JSON.parse(storedUserData);
        const userCharacterIds = userData.characterIds; // 로컬 스토리지에서 캐릭터 ID 배열 가져오기
        
        const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
        setImages(userImages);
      } catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
    };
  
    fetchUserCharacters();
  }, [localStorage.getItem('userData')]);

  return (
    <div className='carousel-container'>
      <div className='carousel-prev'>
        <AiFillCaretLeft className='prevButton' onClick={handlePrevious}/>
      </div>
      <div className='carousel-image'>
        {images[currentIndex] && 
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentIndex}
              timeout={300}
              classNames={`slide-${animationDirection}`}
            >
              <img className='carousel-choose-image' src={images[currentIndex].image} alt="carousel-image" 
              />
            </CSSTransition>
          </SwitchTransition>
        }
      </div>
      <div className='carousel-next'>
        <AiFillCaretRight className='nextButton' onClick={handleNext}/>
      </div>
    </div>
  );
}

export default Carousel;
