import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <h1>로비 페이지</h1>
      <ul>
        <h2>연결 페이지</h2>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/Single">싱글</Link>
        </li>
        <li>
          <Link to="/">멀티</Link>
        </li>
      </ul>
    </div>
  );
}

export default Main;
