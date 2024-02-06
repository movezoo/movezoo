import './Inforoom.css'

function Inforoom({ title, userCount, mode, track, session }) {
  function onClickRoom() {
    console.log({session})
  }

  return (
    <div className="inforoom-container" onClick={onClickRoom}>
      <div className="inforoom-head">
        <div className="inforoom-title">{title}</div>
        <div className="inforoom-user">{userCount}/4</div>
      </div>
      <div className="inforoom-main">
        <div className="inforoom-mode">
          {mode === 1 && "개인전/스피드"}
          {mode === 2 && "팀전/스피드"}
          {mode === 3 && "개인전/아이템"}
          {mode === 4 && "팀전/아이템"}
        </div>
        <div className="inforoom-track">{track}번 맵</div>
      </div>
    </div>
  );
}

export default Inforoom;
