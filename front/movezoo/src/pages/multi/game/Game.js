import styles from "./Game.module.css";
import "./Game.module.css";
// import Webcam from "react-webcam";
import Back from "../../../components/single/game/Back";
import Main from "../../../components/play/Main";
import Cam from "../../../components/play/Cam";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";
import { useRecoilState } from "recoil";

import { isLoadGameState, isLoadDetectState } from '../../../components/state/gameState.js'
import { useEffect } from "react";

function Game(props) {
  const { isPlayingGame, session, mainStreamManager, subscribers, leaveSession } = props;
  
  useEffect(() => {
    // 로딩 초기화
  },[])

  return (
    <div>
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 화면, 게임 화면*/}
        <div className={styles.leftSection}>
          {/* <p style={{ textAlign: "center" }}>
            <strong>게임 화면</strong>
          </p> */}
          
          <Main width={1130} height={700} />

          {/* 뒤로가면 메인 화면*/}
          <div className={styles.goBack}>
            <Back leaveSession={leaveSession}/>
          </div>
          {/*웹캠*/}
          <div className={styles.webCam}>
          {mainStreamManager !== undefined ? (
            <div id="main-video" className="col-md-6">
              <MyVideoComponent
                streamManager={mainStreamManager}
                mySession={session}
                isPlayingGame={isPlayingGame}
              />
            </div>
          ) : "asdf"}
          </div>
          {/* <Webcam className={styles.webCam} mirrored={true} /> */}
          {/* 일단 결과창으로 넘어가는 버튼*/}
          <button onClick={()=> props.setPage(4)}
            style={{
              position: "relative",
              textAlign: "center",
              bottom: "50%",
              width: 160,
              height: 80,
              color: "white",
              backgroundColor: "tomato",
            }}
          >
            넘어가기
            <br />
            (임시버튼)
          </button>
        </div>

        {/*오른쪽 화면*/}
        <div className={styles.rightSection}>
          <div className={styles.userSection}>
            {subscribers.map((sub, i) => (
              <div
                key={sub.id}
                className={styles.userBox}
              >
                <span>{sub.id}</span>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Game;
