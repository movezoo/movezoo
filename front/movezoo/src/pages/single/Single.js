import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Single.module.css";
import Webcam from "react-webcam";
import Map2 from "../../components/single/Map2";
import Back from "../../components/single/Back";

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
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )}

          <div className={styles.goBack}>
            <Back />
          </div>
          <div>
            <button className={styles.btnSelect}>카트 고르기</button>
          </div>
        </div>
        {/*오른쪽 영역*/}
        <div className={styles.rightSection}>
          {/*맵 & 최고기록*/}
          <div>
            <Map2 />
            <p style={{ textAlign: "center" }}>
              최고 기록 : <strong>00:00:00</strong>
            </p>
          </div>
          {/* 시작 버튼*/}
          <Link to="/Game">
            <button className={styles.btnStart}>시작</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Single;
