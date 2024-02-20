import { atom } from 'recoil';


// 로그인 세션 관련 상태를 관리하는 atom
export const sessionState = atom({
  key: 'sessionState',
  default: {
    loggedIn: false,
    sessionId: null,
    userData: null, // 사용자 정보를 담을 필드 추가
  },
});


// 회원가입 관련 상태를 관리하는 atom
export const signUpState = atom({
  key: 'signUpState',
  default: {
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    signedUp: false,
    passwordError: '',
    emailError: '',
  },
});


// 코인 관련 상태를 관리하는 atom
export const userCoin = atom({
  key: 'userCoin',
  default: 0,
});


// 닉네임 관련 상태를 관리하는 atom
export const nickName = atom({
  key: 'nickName',
  default: '',
});


// 프로필 이미지 관련 상태를 관리하는 atom
export const profileImgUrl = atom({
  key: 'profileImgUrl',
  default: '',
})


export const selectCharacterState = atom({
  key: 'selectCharacterState',
  default: 'shiba'
})


export const userCharacterImages = atom({
  key: 'userCharacterImages', 
  default: [], 
});


export const mutedState = atom({
  key: 'mutedState',
  default: false,
});