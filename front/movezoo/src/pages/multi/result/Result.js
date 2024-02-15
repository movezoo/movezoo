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
  const [userIds, setUserIds] = useState([])
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

  useEffect(() => {
    // 컴포넌트가 마운트될 때 전체 화면 모드 종료
    document.exitFullscreen();

    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });

    console.log(`[게임결과]`)
    console.log(playerGameDataList);

    let newIds = [];

    // user 개개인의 ID와 LapTime
    for (let i = 0; i < playerGameDataList.length; i++) {
      const userId = playerGameDataList[i].playerId;
      const userLapTime = playerGameDataList[i].lapTime;

      const isExist = newIds.some(user => user.userId === userId);

      if (!isExist) {
        newIds.push({ userId, userLapTime });
      }
    }

    // userdata laptime 빠른순으로 정렬
    // 통과 못한 랩타임은 뒤로 정렬
    newIds.sort(function(a, b) {

      if (!a.userLapTime && !b.userLapTime) {
        return 0;
      }

      if (!a.userLapTime) {
        return 1;
      }

      if (!b.userLapTime) {
        return -1;
      }

      return a.userLapTime - b.userLapTime;
    });

    setUserIds(newIds)

    


  }, []);

  console.log(`[순위 정렬]`)
  console.log(userIds)

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
                <p>순위</p>
                {
                  userIds.map((user, index) => (
                    <div key={user.userId}>
                      <p>{index + 1}등: {user.userId} - {user.userLapTime}초</p>
                    </div>
                  ))
                }
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
