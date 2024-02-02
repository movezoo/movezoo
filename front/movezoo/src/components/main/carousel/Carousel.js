import React, { useState } from 'react';
import './Carousel.css';
import axios from 'axios';

function Carousel() {

  const initialImages  = [
    { id: 1, name: '캐릭터 1', image: './1.png' },
    { id: 2, name: '캐릭터 2', image: './2.png' },
    { id: 3, name: '캐릭터 3', image: './3.png' },
    { id: 4, name: '캐릭터 4', image: './4.png' },
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
    const fetchUserCharacters  = async () => {
      try {
        const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/3');
        // console.log(response.data[0].racerId);
        const userCharacterIds = response.data.map(character => character.racerId);
        // console.log(userCharacterIds);
        const userImages = initialImages.filter(image => userCharacterIds.includes(image.id));
        setImages(userImages);
      } catch (error) {
        console.error('캐릭터 정보 요청 실패:', error);
      }
    }
    fetchUserCharacters ();
  },[]);

  return (
    <div className='carousel-container'>

      <div className='carousel-prev'>
      <button onClick={handlePrevious}>이전</button>
      
      </div>

      <div className='carousel-image'>
      {images.length > 0 && <img src={images[currentIndex].image} alt="carousel-image" />}
      </div>

      <div className='carousel-next'>
      <button onClick={handleNext}>다음</button>
      </div>

    </div>
  );
}

export default Carousel;
