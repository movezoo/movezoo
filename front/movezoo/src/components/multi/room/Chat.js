import { log } from "@tensorflow/tfjs-core/dist/log";
import styles from "./Chat.module.css";

function Chat(props) {
  const {
    session,
    connectionId,
    chatMessage,
    setChatMessage,
    chatMessages,
    setChatMessages,
  } = props;

  const handleChangeChatMessage = (event) => {
    setChatMessage(event.target.value);
  };

  // 채팅 메시지 함수
  const sendChatMessage = () => {
    console.log(session);

    if (session && chatMessage.trim() !== "") {
      session
        .signal({
          data: chatMessage,
          to: [],
          type: "my-chat",
        })
        .then(() => {
          console.log("Message successfully sent");

          // 채팅 메시지를 보낸 후 텍스트 상자 비우기
          setChatMessage("");
          console.log(chatMessage);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendChatMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatLog}>
        <ul className="chat-container">
          {chatMessages.map((message, index) => (
            <li key={index}>
              {message.name} : {message.message}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatInput}>
        <input
          placeholder="채팅 채팅"
          className={styles.chatText}
          value={chatMessage}
          onChange={handleChangeChatMessage}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.chatBtn} onClick={sendChatMessage}>
          enter
        </button>
      </div>

      {/* 공통 채팅 보여주는  */}
      {/* <div className="col-md-6">
        <ul className="chat-container">
          {chatMessages.map((message, index) => (
            <li key={index}>
              {message.name} : {message.message}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default Chat;
