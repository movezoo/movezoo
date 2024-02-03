const data = {
  isLeftKeyPressed: false,
  isRightKeyPressed: false,
  isSpacebarKeyPressed : false,
  // 실시간 멀티통신을 위한 플레이어 데이터
  playerDataList: [], // { userX, userZ, speed }
  // 현재 진행중인 플레이어 리스트
  playerList: [] // { playerId, playerCharacter }
};



export { data }