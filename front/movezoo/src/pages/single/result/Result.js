import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/single/result/Back";
import Record from "../../../components/single/result/Record";
import "./Result.css";

function Result() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
      <div className="single-result-container">

        <div className="result-header">
          <div>
            <h1 className="result-name">Result</h1>
          </div>
        </div>

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
            {/*기록들*/}
            <div className="result-record">
              <Record />
            </div>
            {/*보상 및 돌아가기 버튼*/}
            <div>
              <div className="result-reward">
                <span>G</span>
                <span>#획득 골드#</span>
                <span>획득!</span>
              </div>
              {/* 돌아가기 버튼*/}
              <div className="result-back-button">
                <Back />
              </div>
            </div>
          </div>

        </div>


      </div>
  );
}
export default Result;
