import { Link, useNavigate } from "react-router-dom";
import "./ResultBack.css";

function ResultBack() {
  const navigate = useNavigate();
  return (
    <div className="resultBack-button">
      {/* <Link className="resultBack-link" to="/main"> */}
        <button className="back-name" onClick={() => navigate("/redirect", { state: { url: "/main" } })}>나가기</button>
      {/* </Link> */}
    </div>
  );
}

export default ResultBack;
