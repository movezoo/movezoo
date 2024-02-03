import styles from "./Record.module.css";

function Record() {
  return (
    <div>
      <div className={styles.title}>LAP TIME</div>
      <div className={styles.time}>00:00:00</div>
      <div className={styles.title}>BEST</div>
      <div className={styles.time}>00:00:00</div>
    </div>
  );
}

export default Record;
