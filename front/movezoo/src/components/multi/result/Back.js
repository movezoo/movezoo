import { Link, useNavigate } from "react-router-dom";
import "./Back.css";

function Back(props) {
  const navigate = useNavigate();
  const handleLeaveGame = () => {
    props.leaveSession()
    // window.location.reload();
    navigate("/redirect", { state: { url: "/main" } })
  }
  return (
    <div className="back-button">
      <div className="back-link" to="/main">
        <button className="back-name" onClick={handleLeaveGame}>돌아가기</button>
      </div>
    </div>
  );
}

export default Back;
