import { atom } from 'recoil';

// export const userState = selector({
//   key: 'userState',
//   get: async () => {
//     const response = await axios.get('https://i10e204.p.ssafy.io/api/user/2403', {});
//     return response.data;
//   }
// })

// 코인 관련 상태를 관리하는 atom
export const userCoin = atom({
  key: 'userCoin',
  default: 0,
});

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

export const nickName = atom({
  key: 'nickName',
  default: '',
});