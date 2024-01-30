import { Link } from "react-router-dom";

function Result() {
  return (
    <div>
      <h1>결과 페이지</h1>
      <div // 일단 축소 화면
        style={{
          display: "flex",
          width: 960,
          height: 540,
        }}
      >
        <div // 왼쪽 화면, 게임 화면
          style={{
            position: "relative",
            color: "white",
            width: 720,
            height: 540,
            backgroundColor: "black",
          }}
        >
          <p style={{ textAlign: "center" }}>
            <strong>웹캠 화면</strong>
          </p>
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
          <div style={{ textAlign: "center" }}>
            <h2>LAP TIME</h2>
            <h3>00:00:00</h3>
            <h2>BEST</h2>
            <h3>00:00:00</h3>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: 10,
              }}
            >
              <span>G</span>
              <span>#획득 골드#</span>
              <span>획득!</span>
            </div>
            {/* 돌아가기 버튼*/}
            <Link to="/Single">
              <button
                style={{
                  textAlign: "center",
                  width: 160,
                  height: 80,
                  margin: 10,
                  backgroundColor: "skyblue",
                }}
              >
                돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Result;
