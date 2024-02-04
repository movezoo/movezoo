import { Link } from "react-router-dom";
import styles from "./Start.module.css";

function Start() {
  return (
    <div>
      <Link to="/Game">
        <button className={styles.btnStart}>시작</button>
      </Link>
    </div>
  );
}

export default Start;
