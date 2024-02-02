import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Single.module.css";
import Webcam from "react-webcam";
import Map2 from "../../components/single/Map2";
import Back from "../../components/single/Back";
import Start from "../../components/single/Start";

function Single() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {/* <h1>싱글 페이지</h1> */}
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 영역*/}
        <div className={styles.leftSection}>
          <div className={styles.infoSection}>
            <div className={styles.goBack}>
              <Back />
            </div>
            <h1>Single Play</h1>
          </div>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )}

          <div>
            <button className={styles.btnSelect}>카트 고르기</button>
          </div>
        </div>
        {/*오른쪽 영역*/}
        <div className={styles.rightSection}>
          {/*맵 & 최고기록*/}
          <div className={styles.btnSelectMap}>
            <Map2 />
          </div>
          {/* 시작 버튼*/}
          <div className={styles.btnStart}>
            <Start />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Single;
