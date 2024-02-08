import { atom } from 'recoil';

// export const userState = selector({
//   key: 'userState',
//   get: async () => {
//     const response = await axios.get('https://i10e204.p.ssafy.io/api/user/2403', {});
//     return response.data;
//   }
// })

export const userCoin = atom({
  key: 'userCoin',
  default: 0,
});