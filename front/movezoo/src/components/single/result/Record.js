import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import "./Record.css";


function Record() {
  const [userLaptime, setUserLaptime] = useState(null);

  useEffect(() => {
    const fetchUserRankings = async (mapNumber) => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        


        const userData = JSON.parse(storedUserData);
        
        const userId = userData.userData.userId;

        console.log(userId);

        const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
        setUserLaptime(userLaptime.data);
        // console.log(userLaptime.data);


      } catch (error) {
        console.error('랭킹 정보 요청 실패:', error);
      }
    }

    
  }, []);

  return (
    <div className="Record-body">
      <div className="title">LAP TIME</div>
      <div className="time">02:01:23</div>
      <div className="title">BEST</div>
      <div className="time">01:53:46</div>
    </div>
  );
}

export default Record;
