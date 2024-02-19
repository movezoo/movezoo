import { useEffect, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Record from "../../../components/single/result/Record";
import "./Result.css";
import { useRecoilState } from 'recoil';
import { userCoin } from '../../../components/state/state';
import { useNavigate } from "react-router-dom";


function Result() {
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useRecoilState(userCoin);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 전체 화면 모드 종료
    document.exitFullscreen();

    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const updateCoin = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        const userData = JSON.parse(storedUserData);
        const nickname = userData.userData.nickname;

        

        const response = await axios.patch('https://i10e204.p.ssafy.io/api/coin',
          { nickname, ranking: 1 });
        
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
  }, []);

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
    <div className="single-result-container">

      <div className="single-result-header">
        <div>
          <h1 className="single-result-name">RESULT</h1>
        </div>
      </div>

      <div className="single-result-body-card">

        <div className="single-result-body">

          <div className="single-result-body-cam">
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              <Webcam className="single-result-webcam" mirrored={true} />
            )}
          </div>

          {/*오른쪽 화면*/}
          <div className="single-result-select">

            <div className="single-result-record">
              <Record />
            </div>

            <div className="single-result-reward">
              <p className="single-reward-coin">+10G</p>
            </div>

            <div className="single-result-back-button">
              <div className="resultBackbtn">
                <button className="back-name" onClick={() => navigate("/redirect", { state: { url: "/main" } })}>나가기</button>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}
export default Result;
