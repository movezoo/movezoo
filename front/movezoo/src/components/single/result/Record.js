import { useEffect, useState } from "react";
import axios from "axios";
import { singleResultState } from "../../../components/state/state.js"
import { useRecoilState } from "recoil";


import "./Record.css";



function Record() {
  const [userLaptime, setUserLaptime] = useState(null);
  const [ singleResult ] = useRecoilState(singleResultState);

  useEffect(() => {
    const fetchUserLaptime = async (mapNumber) => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        const userData = JSON.parse(storedUserData);    
        const userId = userData.userData.userId;
        const mapNumber = userData.selectedMapId;
        
        const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
        
        // 이번 게임 랩타임 db에 보내기
        // if (userLaptime.data < )
        
        
        setUserLaptime(userLaptime.data);
        // console.log(userLaptime.data);


      } catch (error) {
        console.error('랭킹 정보 요청 실패:', error);
      }
    }

    fetchUserLaptime();
    
  }, []);

  return (
    <div className="Record-body">
      <div className="title">LAP TIME</div>
      <div className="time">{singleResult.time}</div>
      <div className="title">BEST</div>
      <div className="time">{userLaptime ? userLaptime.record : 'Loading...'}</div>
    </div>
  );
}

export default Record;
