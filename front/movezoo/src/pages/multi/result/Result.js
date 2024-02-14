import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/multi/result/Back";
import Record from "../../../components/single/result/Record";
import './Result.css';
import { playerGameDataList } from "../../../components/play/data.js";

function Result(props) {
  const [loading, setLoading] = useState(true);
  const leaveSession = props.leaveSession;
  useEffect(() => {
    // 컴포넌트가 마운트될 때 전체 화면 모드 종료
    document.exitFullscreen();

    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });

    console.log(`[게임결과]`)
    console.log(playerGameDataList);
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

                <div className="multi-result-firstWebCam">
                  {loading ? (
                    <h1>Loading...</h1>
                  ) : (
                    <Webcam mirrored={true} />
                  )}
                </div>

                <div className="multi-result-secondCam">
                  2번캠
                </div>

                <div className="multi-result-thirdCam">
                  3번캠
                </div>

                <div className="multi-result-FourthCam">
                  4번캠
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
