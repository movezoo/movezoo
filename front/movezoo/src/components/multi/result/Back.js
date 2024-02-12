import { Link, useNavigate } from "react-router-dom";
import "./Back.css";

function Back(props) {
  const navigate = useNavigate();
  const handleLeaveGame = () => {
    props.leaveSession()
    navigate("/main");
  }
  return (
    <div className="back-button">
      <Link className="back-link" to="/main">
        <button className="back-name" onClick={handleLeaveGame}>돌아가기</button>
      </Link>
    </div>
  );
}

export default Back;
