import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Map2 from "../../components/single/Map2";
import Back from "../../components/single/Back";
import Start from "../../components/single/Start";
import Select from "../../components/select/Select";
import { IoCloseSharp } from "react-icons/io5";
import "./Single.css";

function Single() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div className="single-container">
      
      {/* header */}
      <div className="single-header">
        <div>
          <h1 className="single-name">Single Play!</h1>
        </div>
      </div>

      {/*body*/}
      <div className="single-body-card">
        <div className="Back">
          <Link to="/main">
            <IoCloseSharp className='exit-button'/>
          </Link>
        </div>

        <div className="single-body">

          <div className="single-body-cam">
            
              {loading ? (
                <h1 className="txtLoading">Loading...</h1>
              ) : (
                <Webcam className="single-webCam" mirrored={true} />
              )}
            
          </div>

          <div className="body-selects">

            <div className="map-select">
              <Map2 />
            </div>
            <div className="charact-select">
              <Select />
            </div>
            {/* 시작 버튼*/}
            <div className="start-select">
              <Start />
            </div>
          </div>

        </div>
        

      </div>
    </div>
  );
}
export default Single;
