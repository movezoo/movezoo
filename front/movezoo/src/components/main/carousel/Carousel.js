// import React, { useEffect, useState } from 'react';
// import './Carousel.css';
// import axios from 'axios';
// import { AiFillCaretLeft } from "react-icons/ai";
// import { AiFillCaretRight } from "react-icons/ai";

// function Carousel() {
//   const initialImages  = [
//     { id: 1, name: '퍼그', image: './shop/pug.png' },
//     { id: 2, name: '돼지', image: './shop/pig.png' },
//     { id: 3, name: '소', image: './shop/cow.png' },
//     { id: 4, name: '양', image: './shop/sheep.png' },
//     { id: 5, name: '라마', image: './shop/llama.png' },
//     { id: 6, name: '말', image: './shop/horse.png' },
//     { id: 7, name: '얼룩말', image: './shop/zebra.png' },
//     { id: 8, name: '미정', image: './shop/8.png' },
//   ];

//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
//   };

//   useEffect(() => {
//     const fetchUserCharacters = async () => {
//       try {
//         // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

//         // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
//         //   withCredentials: true, // 쿠키 허용
//         // });
//         // const UserId = loginUserId.data;

//         // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {})

        
//         // 임시 유저 데이터
//         const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/102', {
//         })


//         console.log('===========')
//         console.log(response.data);
//         const userCharacterIds = response.data.map(character => character.racerId);
//         const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
//         setImages(userImages);
//       } catch (error) {
//         console.error('캐릭터 정보 요청 실패:', error);
//       }
//     };

//     fetchUserCharacters();
//   }, []);

//   return (
//     <div className='carousel-container'>
//       <div className='carousel-prev'>
//         <AiFillCaretLeft className='prevButton' onClick={handlePrevious}/>
//       </div>
//       <div className='carousel-image'>
//         {images.length > 0 && <img src={images[currentIndex].image} alt="carousel-image" />}
//       </div>
//       <div className='carousel-next'>
//         <AiFillCaretRight className='nextButton' onClick={handleNext}/>
//       </div>
//     </div>
//   );
// }

// export default Carousel;



// test

import React, { useEffect, useState } from 'react';
import './Carousel.css';
import axios from 'axios';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { CSSTransition, SwitchTransition } from 'react-transition-group';

function Carousel() {
  const initialImages  = [
    { id: 1, name: '퍼그', image: './shop/pug.png' },
    { id: 2, name: '돼지', image: './shop/pig.png' },
    { id: 3, name: '소', image: './shop/cow.png' },
    { id: 4, name: '양', image: './shop/sheep.png' },
    { id: 5, name: '라마', image: './shop/llama.png' },
    { id: 6, name: '말', image: './shop/horse.png' },
    { id: 7, name: '얼룩말', image: './shop/zebra.png' },
    { id: 8, name: '미정', image: './shop/8.png' },
  ];

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('right');

  const handlePrevious = () => {
    setNextIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setAnimationDirection('right');
  };

  const handleNext = () => {
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

        const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
          withCredentials: true, // 쿠키 허용
        });
        const UserId = loginUserId.data;

        const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {})

        
        // 임시 유저 데이터
        // const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/102', {})


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

