import "./Inforoom.css";

function Inforoom({ title, userCount, userMaxCount, mode, track, session }) {
  function onClickRoom() {
    console.log({ session });
  }
  const images = ["n.png", "o.png"];

  return (
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
  );
}

export default Inforoom;
