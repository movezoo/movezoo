import React, { useEffect, useState } from 'react';
import './Carousel.css';
import axios from 'axios';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { CSSTransition, SwitchTransition } from 'react-transition-group';

function Carousel() {
  const initialImages  = [
    { id: 1, name: '퍼그', image: '/images/shop/pug.png' },
    { id: 2, name: '돼지', image: '/images/shop/pig.png' },
    { id: 3, name: '소', image: '/images/shop/cow.png' },
    { id: 4, name: '양', image: '/images/shop/sheep.png' },
    { id: 5, name: '라마', image: '/images/shop/llama.png' },
    { id: 6, name: '말', image: '/images/shop/horse.png' },
    { id: 7, name: '얼룩말', image: '/images/shop/zebra.png' },
    { id: 8, name: '미정', image: '/images/shop/8.png' },
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
        // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

        // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        //   withCredentials: true, // 쿠키 허용
        // });
        // const UserId = loginUserId.data;

        // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {})

        
        // 임시 유저 데이터
        const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/103', {})


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
              <img src={images[currentIndex].image} alt="carousel-image" />
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

