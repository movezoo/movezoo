import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Map2 from "../../components/single/Map2";
import Start from "../../components/single/Start";
import Select from "../../components/select/Select";
import { gameStartData } from "../../components/play/data.js";
import { FaAnglesLeft } from "react-icons/fa6";
import "./Single.css";

function Single() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
    gameStartData.mode = 'single';
  }, []);

  return (
    <div className="single-container">
      
      <Link className="Back" to="/main">
        <FaAnglesLeft className="mr-2" /><p>뒤로가기</p>
      </Link>
      
      {/* header */}
      <div className="single-header">
        <h1 className="single-name">Single Play</h1>
      </div>

      {/* body */}
      <div className="single-body-card">
        <div className="single-body">

          <div className="single-body-cam"> {
            loading ? (<h1 className="txtLoading">Loading...</h1>)
                    : (<Webcam className="single-body-webCam" mirrored={true} />) 
          } </div>
          
          <div className="body-selects">
            <div className="map-select"><Map2 /></div>
            <div className="charact-select"><Select /></div>
            <div className="start-select"><Start /></div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
export default Single;
