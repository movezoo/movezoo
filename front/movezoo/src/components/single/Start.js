import { Link } from "react-router-dom";
import "./Start.css";

function Start() {
  return (
    <div className="single-start-button">
      <Link className="start-link" to="/Game">
        <h1 className="start-name">시작</h1>
      </Link>
    </div>
  );
}

export default Start;
