import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/multi/result/Back";
import Record from "../../../components/single/result/Record";
import './Result.css';
import { playerGameDataList } from "../../../components/play/data.js";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { userCoin } from '../../../components/state/state';

function Result(props) {
  const [loading, setLoading] = useState(true);
  const [userIds, setUserIds] = useState([])
  const [coin, setCoin] = useRecoilState(userCoin);
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

  // 등수에 따라 코인 업데이트
  useEffect(() => {
    const updateCoin = async () => {
      try {
        for (let i = 0; i < userIds.length; i++) {
          const { userId: nickname } = userIds[i];
          
          const response = await axios.patch('https://i10e204.p.ssafy.io/api/coin', 
          { nickname, ranking: i + 1 });
          console.log(userIds[i]);
          console.log(response);
        }

      } catch (error) {
        console.error('코인 업데이트 실패:', error);
      }
    }

    const fetchUserCoin = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
          if (!storedUserData) {
              throw new Error('사용자 정보를 찾을 수 없습니다.');
          }
  
        // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
        const userData = JSON.parse(storedUserData);
  
        // 코인 정보 조회 요청
          const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userData.userData.userId}`, {
              withCredentials: true
          });
  
          if (response.status === 200 && response.data) {
              // Recoil 상태 및 로컬 스토리지 업데이트
              const newCoinAmount = response.data.coin;
              console.log(newCoinAmount)
              setCoin(newCoinAmount); // Recoil 상태 업데이트
             
              let updatedUserData = { ...userData };
              updatedUserData.userData.coin = newCoinAmount;
              localStorage.setItem('userData', JSON.stringify(updatedUserData));
          }
  
  
      } catch (error) {
        console.error('유저 코인 정보 요청 실패:', error);
      }
    }
  
    updateCoin();
    fetchUserCoin();
  }, [userIds]);

  // 유저 코인 정보 업데이트
  useEffect(() => {

    const fetchUserCoin = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
          if (!storedUserData) {
              throw new Error('사용자 정보를 찾을 수 없습니다.');
          }
  
        // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
        const userData = JSON.parse(storedUserData);
  
        // 코인 정보 조회 요청
        const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userData.userData.userId}`, {
            withCredentials: true
        });
  
        if (response.status === 200 && response.data) {
            // Recoil 상태 및 로컬 스토리지 업데이트
            const newCoinAmount = response.data.coin;
            console.log(newCoinAmount)
            setCoin(newCoinAmount); // Recoil 상태 업데이트
            
            let updatedUserData = { ...userData };
            updatedUserData.userData.coin = newCoinAmount;
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }
  
  
      } catch (error) {
        console.error('유저 코인 정보 요청 실패:', error);
      }
    }
  
    fetchUserCoin();
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
                <table className="multi-result-reward-table">
                  <thead className="multi-result-reward-thead">
                    <tr className="multi-result-reward-theadTr">
                      <th className="multi-result-reward-theadTh">순위</th>
                      <th className="multi-result-reward-theadThName">닉네임</th>
                      <th>랩타임</th>
                    </tr>
                  </thead>
                  <tbody className="multi-result-reward-tbody">
                    {/* <tr className="multi-result-reward-tbodyTr">
                      <td>1</td>
                      <td>ssss</td>
                      <td>00:00:00</td>
                    </tr>
                    <tr className="multi-result-reward-tbodyTr">
                      <td>2</td>
                      <td>wwww</td>
                      <td>00:00:00</td>
                    </tr> */}
                    {
                      userIds.map((user, index) => (
                        <tr className="multi-result-reward-tbodyTr" key={user.userId}>
                          <td>{index + 1}</td>
                          <td>{user.userId}</td>
                          <td>{user.userLapTime}초</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
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
