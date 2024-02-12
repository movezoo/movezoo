import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import ResultBack from "../../../components/single/result/ResultBack";
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
                {/* <p className="reward-alarm">획득!</p> */}
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
