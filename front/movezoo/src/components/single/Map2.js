import React, { useState } from "react";
import "./Map2.css";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";

function Carousel() {
  const images = ["n.png", "o.png"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((nextIndex) =>
      nextIndex === images.length - 1 ? 0 : nextIndex + 1
    );
  };

  return (
    <div className="map-container">

      <div className="map-header">
        <div className="map-prev">
          <AiFillCaretLeft className='map-change-button' onClick={handlePrevious}/>
        </div>
        <div className="map-image">
          <img src={`/minimap/${images[currentIndex]}`} alt="mini-map" />
        </div>
        <div className="map-next">
          <AiFillCaretRight className='map-change-button' onClick={handleNext}/>
        </div>
      </div>

      <div className="map-body">
        <p className="map-record-name">
          BEST LAP
        </p>
        <p className="best-map-record">
          00:00:00
        </p>
        
      </div>
    </div>
  );
}

export default Carousel;
