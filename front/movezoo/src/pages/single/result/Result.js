import { useEffect, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import ResultBack from "../../../components/single/result/ResultBack";
import Record from "../../../components/single/result/Record";
import "./Result.css";




function Result() {
  const [ loading, setLoading ] = useState(true);


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

        console.log(userData.userData.nickname);

        const response = await axios.patch('https://i10e204.p.ssafy.io/api/coin', 
        { nickname, ranking: 1 });
        console.log(response.data);
      } catch (error) {
        console.error('코인 업데이트 실패:', error);
      }
    }
  
    updateCoin();
  }, []);


  return (
      <div className="single-result-container">

        <div className="result-header">
          <div>
            <h1 className="result-name">RESULT</h1>
          </div>
        </div>

        <div className="result-body-card">

          <div className="result-body">

            <div className="result-body-cam">
              {loading ? (
                <h1>Loading...</h1>
              ) : (
                <Webcam className="result-webcam" mirrored={true} />
              )}
            </div>

            {/*오른쪽 화면*/}
            <div className="result-select">
              
              <div className="result-record">
                <Record />
              </div>
              
              <div className="result-reward">
                <p className="reward-coin">+10G</p>
              </div>
              
              <div className="result-back-button">
                <ResultBack />
              </div>
              
            </div>

          </div>
        </div>


      </div>
  );
}
export default Result;
