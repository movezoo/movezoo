import { Link } from "react-router-dom";
import styles from "./Back.module.css";

function Back() {
  return (
    <div>
      <Link to="/Single">
        <button className={styles.btnStart}>돌아가기</button>
      </Link>
    </div>
  );
}

export default Back;
