import { Link } from "react-router-dom";
import styles from "./Ready.module.css";

function Ready() {
  return (
    <div>
      <Link to="/Game">
        <button className={styles.btnReady}>준비</button>
      </Link>
    </div>
  );
}

export default Ready;
