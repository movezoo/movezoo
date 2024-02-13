import { Link } from "react-router-dom";
import './Start.css'

function Start(props) {
  const onClick = () => props.setPage(3)
  return (
    <div className="start-button" onClick={onClick}>
      <div className="start-link">
        <h1 className="start-name">시작</h1>
      </div>
    </div>
  );
}

export default Start;
