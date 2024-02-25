import { useEffect, useState } from "react";
import axios from "axios";
import { singleResultState } from "../../../components/state/gameState.js"
import { useRecoilState } from "recoil";


import "./Record.css";



function Record() {
  const [userLaptime, setUserLaptime] = useState(null);
  const [ singleResult ] = useRecoilState(singleResultState);

  const convertToTimeFormat = (laptime) => {
    const minutes = Math.floor(laptime / 60);
    const seconds = Math.floor(laptime % 60);
    const milliseconds = Math.floor((laptime % 1) * 100);

    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    const millisecondsStr = milliseconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}:${millisecondsStr}`;
  };

  
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
        
        const userLaptime = await axios.get(`https://i10e204.p.ssafy.io/api/laptime/${userId}/${mapNumber}`);
        
        console.log(userLaptime.data.record);
        
        // 이번 게임 랩타임 db에 보내기
        if (userLaptime.data.record > singleResult.time && singleResult.time !== 0) {
          try {
            // console.log(userId)
            // console.log(mapNumber)
            // console.log(userLaptime.record)
            // console.log(singleResult.time)
            const updateLaptime = await axios.patch('https://i10e204.p.ssafy.io/api/laptime', 
            { userId, trackId: mapNumber, record: singleResult.time });
            
            console.log('랩타임 업데이트 성공:', updateLaptime);
          } catch (error) {
            console.error('랩타임 업데이트 실패:', error);
          }
        }
        
        // db에 랩타임이 없으면 이번 게임 랩타임을 db에 보내기
        if (!userLaptime.data.record && singleResult.time !== 0) {
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
      <div className="time">{convertToTimeFormat(singleResult.time)}</div>
      <div className="title">BEST</div>
      <div className="time">{userLaptime ? convertToTimeFormat(userLaptime.data.record) : 'No Record'}</div>
    </div>
  );
}

export default Record;