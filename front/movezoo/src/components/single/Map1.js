import React, { useState } from "react";
import Modal from "react-modal";

const Map = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const images = ["o.png", "n.png"];

  const handleImageClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <button onClick={openModal}>
        <img src={images[currentIndex]} />
      </button>

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <h1>맵 선택</h1>
        <hr />
        {images.map((minimap, index) => (
          <button
            key={index}
            style={index === currentIndex ? "border: 2px solid blue" : ""}
            onClick={() => handleImageClick(index)}
          >
            <img alt="map-image" src={`/minimap/${minimap}`} />
          </button>
        ))}
        <hr />
        <button onClick={closeModal}>선택</button>
        <button onClick={closeModal}>취소</button>
      </Modal>
    </div>
  );
};

export default Map;
