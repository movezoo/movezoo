import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>시작 페이지</h1>
      <h2>컴포넌트</h2>
      <p>뒷배경, 스위치, 입력칸</p>
      <ul>
        <h2>연결 페이지</h2>
        <li>
          <Link to="/Main">메인으로</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
