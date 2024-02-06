import { Link } from "react-router-dom";
import "./Start.css";

function Start() {
  return (
    <div>
      <Link to="/Game">
        <button className="btnStart">시작</button>
      </Link>
    </div>
  );
}

export default Start;
