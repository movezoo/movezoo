import { atom } from 'recoil';



// 게임 중 현재시간(Lap time)
export const gameCurrentTimeState = atom({
  key: 'gameState',
  default: 0
});

// 게임 중 왼쪽 아이템
export const gameMyItemLeftState = atom({
  key: 'gameMyItemLeftState',
  default: ''
})

// 게임 중 오른쪽 아이템
export const gameMyItemRightState = atom({
  key: 'gameMyItemRightState',
  default: ''
})

// 게임 시작할 때 3초 count
export const gameStartCountState = atom({
  key: 'gameStartCountState',
  default: 4
})

// 게임 끝날 때 10초 count
export const gameEndCountState = atom({
  key: 'gameEndCountState',
  default: 11
})

// 10초가 지나 게임이 모두 종료되었음을 알림
export const gameEndState = atom({
  key: 'gameEndState',
  default: false
})

export const startReadyUserCountState = atom({
  key: 'startReadyUserCountState',
  default: 0
})

export const singleResultState = atom({
  key: 'singleResultState',
  default: {}
})

export const isPlayingGameState = atom({
  key: 'isPlayingGameState',
  default: false
})

export const isLoadGameState = atom({
  key: 'isLoadGameState',
  default: false
})

export const isLoadDetectState = atom({
  key: 'isLoadDetectState',
  default: false
})

export const isGameEndState = atom({
  key: 'isGameEndState',
  default: false
})

export const isMultiGameStartState = atom({
  key: 'isMultiGameStartState',
  default: false
})

export const playGameModeState = atom({
  key: 'playGameModeState',
  default: 'single'
})