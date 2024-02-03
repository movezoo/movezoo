import React, { useState } from "react";
import styles from "./Map2.module.css";

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
        <img src={`/minimap/${images[currentIndex]}`} alt="mini-map" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "gray",
        }}
      >
        <button onClick={handlePrevious} className={styles.btnMapSelect}>
          ←이전
        </button>
        <p className={styles.timeRecord}>
          최고 기록 <br/> <strong>00:00:00</strong>
        </p>
        <button onClick={handleNext} className={styles.btnMapSelect}>
          다음→
        </button>
      </div>
    </div>
  );
}

export default Carousel;
