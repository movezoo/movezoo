import { Link } from "react-router-dom";

function Game() {
  return (
    <div>
      <h1>게임 페이지</h1>
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
            backgroundColor: "navy",
          }}
        >
          <p style={{ textAlign: "center" }}>
            <strong>게임 화면</strong>
          </p>
          {/* 뒤로가면 메인 화면*/}
          <Link to="/Main">
            <button
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
          <div // 웹캠
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 160,
              backgroundColor: "grey",
            }}
          >
            웹캠 화면
          </div>
        </div>

        <div // 오른쪽 화면
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 240,
            height: 540,
            backgroundColor: "tomato",
          }}
        >
          {/* 일단 결과창으로 넘어가는 버튼*/}
          <Link to="/Result">
            <button
              style={{
                textAlign: "center",
                width: 160,
                height: 80,
                backgroundColor: "skyblue",
              }}
            >
              넘어가기<br/>(임시버튼)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Game;
