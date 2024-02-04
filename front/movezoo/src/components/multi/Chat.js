import styles from "./Chat.module.css"

function Chat() {
  return (
    <div className={styles.container}>
      <div className={styles.chatLog}>
        asdf
      </div>
      <div className={styles.chatInput}>
        <div className={styles.chatText}>input</div>
        <button className={styles.chatBtn}>enter</button>
      </div>
    </div>
  )
}

export default Chat;