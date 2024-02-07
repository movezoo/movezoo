import styles from "./Chat.module.css"

function Chat() {
  return (
    <div className={styles.container}>
      <div className={styles.chatLog}>
        asdf
      </div>
      <div className={styles.chatInput}>
        <input placeholder="채팅 채팅" className={styles.chatText}/>
        <button className={styles.chatBtn}>enter</button>
      </div>
    </div>
  )
}

export default Chat;