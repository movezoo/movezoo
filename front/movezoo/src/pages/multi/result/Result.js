import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/multi/result/Back";
import Record from "../../../components/single/result/Record";
import './Result.css';
import { playerGameDataList } from "../../../components/play/data.js";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";

function Result(props) {
  const [loading, setLoading] = useState(true);
  const leaveSession = props.leaveSession;
  const {
    setPage,
    session,
    myRoom,
    mainStreamManager,
    subscribers,
    setSubscribers,
    publisher,
    mySessionId,
    connectionId,
    chatMessage,
    setChatMessage,
    chatMessages,
    setChatMessages
  } = props

  let userIds = [];

  useEffect(() => {
    // 컴포넌트가 마운트될 때 전체 화면 모드 종료
    document.exitFullscreen();

    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });

    console.log(`[게임결과]`)
    console.log(playerGameDataList);

    // user 개개인의 ID와 LapTime
    for (let i = 0; i < playerGameDataList.length; i++) {
      const userId = playerGameDataList[i].playerId;
      const userLapTime = playerGameDataList[i].lapTime;
      userIds.push({ userId, userLapTime });
    }

    // userdata laptime 빠른순으로 정렬
    userIds.sort(function(a, b) {
      return a.userLapTime - b.userLapTime;
    });

    console.log(userIds);


  }, []);
  return (
    <div>
      {/*일단 축소 화면*/}
      <div className="multi-result-container">

        <div className="multi-result-header">
          <div>
            <p className="multi-result-name">RESULT</p>
          </div>
        </div>

        {/* body */}
        <div className="multi-result-body-card">

          <div className="multi-result-body">

            {/*왼쪽 화면, 웹캠 화면*/}
            <div className="multi-result-leftSection">

              <div className="multi-result-CamSection">

                <div className="multi-result-bodyWebCam">
                  {mainStreamManager !== undefined ? (
                    <div className="multi-result-webCam">
                      <MyVideoComponent
                        streamManager={mainStreamManager}
                        mySession={session}
                        />
                    </div>
                    ) : <h1 className="txtLoading">Loading...</h1>
                  }
                  {subscribers.map((sub, i) => (
                    <div className="multi-result-webCam">
                      <UserVideoComponent className="room-webCam" streamManager={sub} />
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/*오른쪽 화면*/}
            <div className="multi-result-rightSection">

              {/*보상 및 돌아가기 버튼*/}
              
              <div className="multi-result-reward">
                <span>G</span>
                <span>#획득 골드#</span>
                <span>획득!</span>
              </div>
              
              {/* 돌아가기 버튼*/}
              <div className="multi-result-backbutton">
                <Back leaveSession={leaveSession}/>
              </div>
              

            </div>


          </div>

        </div>



      </div>
    </div>
  );
}
export default Result;
