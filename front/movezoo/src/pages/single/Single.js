import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Map2 from "../../components/single/Map2";
import Back from "../../components/single/Back";
import Start from "../../components/single/Start";
import "./Single.css";

function Single() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      <div className="single-container">
        
        {/* header */}
        <div>
          <h1 style={{ margin: 10 }}>Single Play</h1>
          <div className="goBack">
            <Back />
          </div>
        </div>

        {/*body*/}
        <div>

          <div className={styles.leftSection}>
            <div className={styles.infoSection}>
            </div>
            {loading ? (
              <h1 className={styles.txtLoading}>Loading...</h1>
            ) : (
              <Webcam className={styles.webCam} mirrored={true} />
            )}
          </div>
          
          <div className={styles.rightSection}>
            {/*맵 & 최고기록*/}
            <div className={styles.btnSelectMap}>
              <Map2 />
            </div>
            <div className="charact-select">
              <button className={styles.btnSelect}>카트 고르기</button>
            </div>
            {/* 시작 버튼*/}
            <div className={styles.btnStart}>
              <Start />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Single;
