import "./Inforoom.css";
import { Link } from 'react-router-dom';



function Inforoom( props ) {
  // 참고: [React Router Document](https://reactrouter.com/en/main/components/link)

  // 방입장 로직
  const enterRoom = () => {
    
  }

  // 방 클릭 시
  const onClickRoom = () => {
    // 필요한 데이터 : 사용자 ID, sessionID
    // console.log(props.session);
    props.func(props.session) 
    props.setPage(2);
  }
  const images = ["n.png", "o.png"];

  return (
    // state에 필요한 데이터 객체 전달
    <div className="inforoom-container" onClick={onClickRoom}>
      <div className="inforoom-head">
        <div className="inforoom-title">{props.title}</div>
        <div className="inforoom-user">{props.userCount}/{props.userMaxCount}</div>
      </div>
      <div className="inforoom-body">
        <div className="inforoom-mode">
          {props.mode === 0 && <>개인전<br/>스피드</>}
          {props.mode === 1 && <>팀전<br/>스피드</>}
          {props.mode === 2 && <>개인전<br/>아이템</>}
          {props.mode === 3 && <>팀전<br/>아이템</>}
        </div>
        <div className="inforoom-track">
          <img src={`/minimap/${images[props.track]}`} alt="mini-map" />
        </div>
      </div>
    </div>
  );
}

export default Inforoom;
