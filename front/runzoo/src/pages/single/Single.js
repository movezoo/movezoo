import { Link } from "react-router-dom";
import styles from "./Single.module.css"

function Single() {
  return (
    <div>
      <h1>싱글 페이지</h1>
      <div className={styles.container}>
        <div className={styles.leftsection}>
          <span>웹캠 화면</span>
          <Link to="/Main">
            <button // 뒤로가기
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 160,
                height: 80,
                margin: 10,
                backgroundColor: "grey",
              }}
            >
              뒤로 가기
            </button>
          </Link>
          <div>
            <button
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 320,
                height: 240,
                margin: 10,
                backgroundColor: "grey",
              }}
            >
              카트 고르기
            </button>
          </div>
        </div>
        <div // 오른쪽 화면
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: 240,
            height: 540,
            backgroundColor: "tomato",
          }}
        >
          {/*맵 & 최고기록*/}
          <div>
            <button
              style={{
                width: 200,
                height: 150,
                margin: 10,
                backgroundColor: "white",
              }}
            >
              맵
            </button>
            <p style={{ textAlign: "center" }}>
              최고 기록 : <strong>00:00:00</strong>
            </p>
          </div>
          {/* 시작 버튼*/}
          <Link to="/Game">
            <button
              style={{
                textAlign: "center",
                width: 160,
                height: 80,
                margin: 10,
                backgroundColor: "skyblue",
              }}
            >
              시작
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Single;
