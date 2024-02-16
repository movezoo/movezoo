import { Link } from "react-router-dom";
import axios from "axios";
import './Start.css'

function Start(props) {
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

  const roomGameStart = async(mySessionId)=>{
    const response = await axios.patch(
      APPLICATION_SERVER_URL + "api/room/start",
      {
        roomSessionId: mySessionId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  
    // console.log("roomGameStart result : ",response.data)
  }

  const onClick = () =>{
    const {
      session,
      mySessionId
    } = props

    if (session) {
      session
        .signal({
          to: [],
          type: "game-start",
        })
        .then(() => {
          // console.log("game start done")
          roomGameStart(mySessionId);
          // console.log(`mySessionId: ${mySessionId}`);
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
