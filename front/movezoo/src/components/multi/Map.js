import React, { useState } from "react";
import styles from "./Map.module.css";

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
    <div>
      <div className={styles.mapImage}>
        <button onClick={handlePrevious} className={styles.btnPrevious}>
          &lt;
        </button>
        <img src={`/minimap/${images[currentIndex]}`} alt="mini-map" />
        <button onClick={handleNext} className={styles.btnNext}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Carousel;
