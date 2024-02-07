import "./Inforoom.css";
import { Link } from 'react-router-dom';



function Inforoom({ title, userCount, userMaxCount, mode, track, session }) {
  // 참고: [React Router Document](https://reactrouter.com/en/main/components/link)

  // 방입장 로직
  const enterRoom = () => {
    
  }

  // 방 클릭 시
  const onClickRoom = () => {
    // 필요한 데이터 : 사용자 ID, sessionID
    // console.log({ session });
  }
  const images = ["n.png", "o.png"];

  return (
    // state에 필요한 데이터 객체 전달
    <Link to= '/multi' state= {{ session: session }}>
      <div className="inforoom-container" onClick={onClickRoom}>
        <div className="inforoom-head">
          <div className="inforoom-title">{title}</div>
          <div className="inforoom-user">{userCount}/{userMaxCount}</div>
        </div>
        <div className="inforoom-body">
          <div className="inforoom-mode">
            {mode === 1 && <>개인전<br/>스피드</>}
            {mode === 2 && <>팀전<br/>스피드</>}
            {mode === 3 && <>개인전<br/>아이템</>}
            {mode === 4 && <>팀전<br/>아이템</>}
          </div>
          <div className="inforoom-track">
            <img src={`/minimap/${images[track-1]}`} alt="mini-map" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Inforoom;
