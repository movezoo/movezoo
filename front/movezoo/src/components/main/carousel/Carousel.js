import React, { useEffect, useState } from 'react';
import './Carousel.css';
import axios from 'axios';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { CSSTransition, SwitchTransition } from 'react-transition-group';

function Carousel() {
  const initialImages  = [
    { id: 1, name: '시바', image: '/images/shop/shiba.png' },
    { id: 2, name: '당나귀', image: '/images/shop/donkey.png' },
    { id: 3, name: '여우', image: '/images/shop/fox.png' },
    { id: 4, name: '사슴', image: '/images/shop/deer.png' },
    { id: 5, name: '허스키', image: '/images/shop/husky.png' },
    { id: 6, name: '늑대', image: '/images/shop/wolf.png' },
    { id: 7, name: '말', image: '/images/shop/horse.png' },
    { id: 8, name: '순록', image: '/images/shop/stag.png' },
  ];

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('right');

  const handlePrevious = () => {
    if (images.length === 1) return; // 이미지가 하나만 있을 경우 아무 작업도 수행하지 않음
    setNextIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setAnimationDirection('right');
  };

  const handleNext = () => {
    if (images.length === 1) return; // 이미지가 하나만 있을 경우 아무 작업도 수행하지 않음
    setNextIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setAnimationDirection('left');
  };

  useEffect(() => {
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
    }
  }, [nextIndex]);

  useEffect(() => {
    const fetchUserCharacters = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        
        const userData = JSON.parse(storedUserData);
        
        
        const userId = userData.userData.userId;
        
        console.log(userId);
        
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${userId}`, {})

        console.log('===========')
        console.log(response.data);
        const userCharacterIds = response.data.map(character => character.racerId);
        const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
        setImages(userImages);
      } catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
    };

    fetchUserCharacters();
  }, []);

  return (
    <div className='carousel-container'>
      <div className='carousel-prev'>
        <AiFillCaretLeft className='prevButton' onClick={handlePrevious}/>
      </div>
      <div className='carousel-image'>
        {images.length > 0 && 
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentIndex}
              timeout={300}
              classNames={`slide-${animationDirection}`}
            >
              <img className='carousel-choose-image' src={images[currentIndex].image} alt="carousel-image" />
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

