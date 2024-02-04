import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Result.module.css";
import Webcam from "react-webcam";
import Back from "../../components/result/Back";
import Record from "../../components/result/Record";

function Result() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 화면, 웹캠 화면*/}
        <div className={styles.leftSection}>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )}
        </div>

        {/*오른쪽 화면*/}
        <div className={styles.rightSection}>
          {/*기록들*/}
          <div className={styles.timeRecord}>
            <Record />
          </div>
          {/*보상 및 돌아가기 버튼*/}
          <div>
            <div className={styles.resultReward}>
              <span>G</span>
              <span>#획득 골드#</span>
              <span>획득!</span>
            </div>
            {/* 돌아가기 버튼*/}
            <div className={styles.btnStart}>
              <Back />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Result;
