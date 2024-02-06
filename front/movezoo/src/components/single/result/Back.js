import { Link } from "react-router-dom";
import "./Back.css";

function Back() {
  return (
    <div className="back-button">
      <Link className="back-link" to="/main">
        <button className="back-name">돌아가기</button>
      </Link>
    </div>
  );
}

export default Back;
