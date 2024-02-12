import { Link } from "react-router-dom";
import "./ResultBack.css";

function ResultBack() {
  return (
    <div className="resultBack-button">
      <Link className="resultBack-link" to="/main">
        <button className="back-name">나가기</button>
      </Link>
    </div>
  );
}

export default ResultBack;
