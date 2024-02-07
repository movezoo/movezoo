import { Link } from "react-router-dom";
import styles from "./Ready.module.css";

function Ready(props) {
  function onClick() {
    console.log(props);
    props.setPage(3);
  }
  return (
    <div state={{mySessionId: props.mySessionId, isGameStart:props.isGameStart}}>
        <button onClick={onClick} className={styles.btnReady}>준비</button>
    </div>
  );
}

export default Ready;
