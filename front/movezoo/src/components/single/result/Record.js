import { useEffect, useState } from "react";
import axios from "axios";
import { singleResultState } from "../../../components/state/gameState.js"
import { useRecoilState } from "recoil";


import "./Record.css";



function Record() {
  const [userLaptime, setUserLaptime] = useState(null);
  const [ singleResult ] = useRecoilState(singleResultState);

  
  useEffect(() => {
    const fetchUserLaptime = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }
        const userData = JSON.parse(storedUserData);    
        const userId = userData.userData.userId;
        const mapNumber = userData.selectedMapId;

        console.log(userId)
        console.log(mapNumber)
        
        const { data: userLaptime } = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
        
        
        // 이번 게임 랩타임 db에 보내기
        if (userLaptime.record > singleResult.time ) {
          try {
            console.log(userId)
            console.log(mapNumber)
            console.log(userLaptime.record)
            console.log(singleResult.time)
            const updateLaptime = await axios.patch('https://i10e204.p.ssafy.io/api/laptime', 
            { userId, trackId: mapNumber, record: singleResult.time });
            
            console.log('랩타임 업데이트 성공:', updateLaptime);
          } catch (error) {
            console.error('랩타임 업데이트 실패:', error);
          }
        }
        
        // db에 랩타임이 없으면 이번 게임 랩타임을 db에 보내기
        if (!userLaptime.record) {
          try {
            const updateLaptime = await axios.patch('https://i10e204.p.ssafy.io/api/laptime', 
            { userId, trackId: mapNumber, record: singleResult.time });
    
            console.log('랩타임 업데이트 성공:', updateLaptime);
          } catch (error) {
            console.error('랩타임 업데이트 실패:', error);
          }
        }
        
        setUserLaptime(userLaptime);
        // console.log(userLaptime);
  
      } catch (error) {
        console.error('랭킹 정보 요청 실패:', error);
      }
    }
  
    fetchUserLaptime();
    
  }, [singleResult.time]);



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
