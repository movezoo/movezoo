import { Link } from "react-router-dom";
import styles from "./Single.module.css";
import Webcam from "react-webcam";
import { useEffect, useState } from "react";

function Single() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      <h1>싱글 페이지</h1>
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 영역*/}
        <div className={styles.leftSection}>
          {loading ? (
            <strong>Loading...</strong>
          ) : (
            <Webcam
              style={{
                width: 720,
                height: 540,
              }}
              mirrored={true}
            />
          )}

          <Link to="/Main">
            <button className={styles.goBack}>뒤로 가기</button>
          </Link>
          <div>
            <button className={styles.btnBack}>카트 고르기</button>
          </div>
        </div>
        {/*오른쪽 영역*/}
        <div className={styles.rightSection}>
          {/*맵 & 최고기록*/}
          <div>
            <button className={styles.mapSelect}>맵</button>
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
