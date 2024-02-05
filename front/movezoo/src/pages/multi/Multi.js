import { useEffect, useState } from "react";
import styles from "./Multi.module.css";
import Back from "../../components/multi/Back";
import Map from "../../components/multi/Map";
import Chat from "../../components/multi/Chat";
import Ready from "../../components/multi/Ready";

function Multi() {
  return (
    <div>
      <div className={styles.container}>
        {/*왼쪽 영역*/}
        <div className={styles.leftSection}>
          <div className={styles.infoSection}>
            <div className={styles.goBack}>
              <Back />
            </div>
            <h1 style={{ margin: 10 }}>Multi Play</h1>
          </div>
          <div className={styles.userSection}>
            <div className={styles.userBox}>유저 1</div>
            <div className={styles.userBox}>유저 2</div>
            <div className={styles.userBox}>유저 3</div>
            <div className={styles.userBox}>유저 4</div>
          </div>
          {/* {loading ? (
            <h1 className={styles.txtLoading}>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )} */}

          {/* <div>
            <button className={styles.btnSelect}>카트 고르기</button>
          </div> */}
        </div>
        {/*오른쪽 영역*/}
        <div className={styles.rightSection}>
          {/*맵*/}
          <div className={styles.btnSelectMap}>
            <Map />
          </div>
          {/* 채팅 */}
          <div className={styles.areaChat}>
            <Chat />
          </div>
          {/* 준비 버튼*/}
          <div className={styles.btnReady}>
            <Ready />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Multi;
