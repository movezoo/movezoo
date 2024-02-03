// import React, { useEffect, useState } from 'react';
// import './Carousel.css';
// import axios from 'axios';
// import { AiFillCaretLeft } from "react-icons/ai";
// import { AiFillCaretRight } from "react-icons/ai";

// function Carousel() {

//   const initialImages  = [
//     { id: 1, name: '캐릭터 1', image: './shop/1.png' },
//     { id: 2, name: '캐릭터 2', image: './shop/2.png' },
//     { id: 3, name: '캐릭터 3', image: './shop/3.png' },
//     { id: 4, name: '캐릭터 4', image: './shop/4.png' },
//     { id: 5, name: '캐릭터 5', image: './shop/5.png' },
//     { id: 6, name: '캐릭터 6', image: './shop/6.png' },
//     { id: 7, name: '캐릭터 7', image: './shop/7.png' },
//     { id: 8, name: '캐릭터 8', image: './shop/8.png' },
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
//     const fetchUserCharacters  = async () => {
//       try {
//         const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/3');
//         // console.log(response.data[0].racerId);
//         const userCharacterIds = response.data.map(character => character.racerId);
//         // console.log(userCharacterIds);
//         const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
//         setImages(userImages);
//       } catch (error) {
//         console.error('캐릭터 정보 요청 실패:', error);
//       }
//     }
//     fetchUserCharacters ();
//   },[]);

//   return (
//     <div className='carousel-container'>

//       <div className='carousel-prev'>
//         <AiFillCaretLeft onClick={handlePrevious}/>
//       </div>

//       <div className='carousel-image'>
//       {images.length > 0 && <img src={images[currentIndex].image} alt="carousel-image" />}
//       </div>

//       <div className='carousel-next'>
//         <AiFillCaretRight onClick={handleNext}/>
//       </div>

//     </div>
//   );
// }

// export default Carousel;




// test sessionID
import React, { useEffect, useState } from 'react';
import './Carousel.css';
import axios from 'axios';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import Session from 'react-session-api';

function Carousel() {
  const initialImages  = [
    { id: 1, name: '캐릭터 1', image: './shop/1.png' },
    { id: 2, name: '캐릭터 2', image: './shop/2.png' },
    { id: 3, name: '캐릭터 3', image: './shop/3.png' },
    { id: 4, name: '캐릭터 4', image: './shop/4.png' },
    { id: 5, name: '캐릭터 5', image: './shop/5.png' },
    { id: 6, name: '캐릭터 6', image: './shop/6.png' },
    { id: 7, name: '캐릭터 7', image: './shop/7.png' },
    { id: 8, name: '캐릭터 8', image: './shop/8.png' },
  ];

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const fetchUserCharacters = async () => {
      try {
        const jsessionidRegex = /JSESSIONID=([^;]+)/;
       
        const match = document.cookie.match(jsessionidRegex);
        console.log(match);
        const jsessionid = match && match[1];

        const response = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
          withCredentials: true, // 쿠키 허용
        });
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
        <AiFillCaretLeft onClick={handlePrevious}/>
      </div>
      <div className='carousel-image'>
        {images.length > 0 && <img src={images[currentIndex].image} alt="carousel-image" />}
      </div>
      <div className='carousel-next'>
        <AiFillCaretRight onClick={handleNext}/>
      </div>
    </div>
  );
}

export default Carousel;

