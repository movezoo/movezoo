import { Link } from "react-router-dom";
import './Start.css'

function Start(props) {
  const onClick = () =>{
    const {
      session
    } = props

    if (session) {
      session
        .signal({
          to: [],
          type: "game-start",
        })
        .then(() => {
          console.log("game start done")
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  return (
    <div className="start-button" onClick={onClick}>
      <div className="start-link">
        <h1 className="start-name">시작</h1>
      </div>
    </div>
  );
}

export default Start;
