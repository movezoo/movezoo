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
      <div>
        <img src={`/minimap/${images[currentIndex]}`} alt="mini-map" />
      </div>

      <div>
        <button onClick={handlePrevious} className={styles.btnMapSelect}>
          ←이전
        </button>
        <button onClick={handleNext} className={styles.btnMapSelect}>
          다음→
        </button>
      </div>

      <div>
        <p style={{ textAlign: "center" }}>
          최고 기록 : <strong>00:00:00</strong>
        </p>
      </div>
    </div>
  );
}

export default Carousel;
