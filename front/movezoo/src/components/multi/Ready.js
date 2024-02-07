import { Link } from "react-router-dom";
import styles from "./Ready.module.css";

function Ready(props) {
  console.log(props);
  return (
    <div>
      <Link to="/multiGame" state={{mySessionId: props.mySessionId, isGameStart:props.isGameStart}}>
        <button className={styles.btnReady}>준비</button>
      </Link>
    </div>
  );
}

export default Ready;
