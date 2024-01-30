import React, { useState } from 'react';
import Modal from 'react-modal';

const Shop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ownedCharacters, setOwnedCharacters] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  
  const images = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
  ];

  const isCharacterOwned = (index) => {
    return ownedCharacters.includes(index);
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <button onClick={openModal}>상점</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <h1>상점</h1>
        <hr/>
        <h3>유저 재화</h3>
        {images.map((image, index) => (
          <img
            key={index}
            src={isCharacterOwned(index) ? image : 'black.png'}
            alt="carousel-image"
            onClick={() => handleImageClick(index)}
          />
        ))}
        <hr/>
        <img src={images[currentIndex]} alt="carousel-image" />
        
        <hr/>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Shop;

