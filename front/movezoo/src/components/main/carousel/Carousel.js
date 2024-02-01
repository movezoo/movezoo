import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import './Carousel.css';

function Carousel() {
  const images = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    // Add more image file names here
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className='carousel-container'>

      <div className='carousel-prev'>
      <button onClick={handlePrevious}>이전</button>
      
      </div>

      <div className='carousel-image'>
      <img src={images[currentIndex]} alt="carousel-image" />
      </div>

      <div className='carousel-next'>
      <button onClick={handleNext}>다음</button>
      </div>

    </div>
  );
}

export default Carousel;
