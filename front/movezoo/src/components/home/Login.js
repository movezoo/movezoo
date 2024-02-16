import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import './Login.css';
import { sessionState } from '../../components/state/state'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useRecoilState(sessionState);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('userEmail', username);
      formData.append('password', password);

      const response = await axios.post('https://i10e204.p.ssafy.io/api/login', formData, {
        withCredentials: true,
      });

      // console.log(response);
      // console.log("------------------------");
      // console.log(response.data);
      // console.log("------------------------");
      // console.log(response.data.success);
      // console.log("------------------------");
      // console.log(response.status);

      if (response.status === 200) {
        const newSession = {
          loggedIn: true,
          sessionId: response.data.sessionId,
          userData: response.data.loginUser, // 받아온 사용자 정보를 userData에 저장
        };
        setSession(newSession);

        // console.log(newSession)
        
        // 로그인 성공 시 localStorage에 userData 저장
        localStorage.setItem('userData', JSON.stringify(newSession));

        // console.log(localStorage.getItem('userData'));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        navigate('/main');
      } else {
        alert('id 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('로그인 실패하였습니다.', error);
      alert('로그인 실패하였습니다.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='login-container'>
          <input
            className="logininput"
            type="text"
            name="userEmail"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        <br />
          <input
            className="logininput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        <br />
        <button className="loginbt" onClick={handleLogin}>
          로그인
        </button>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useRecoilState } from 'recoil';
// import axios from 'axios';
// import './Login.css';
// import { sessionState } from '../../components/state/state'

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [session, setSession] = useRecoilState(sessionState);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault(); // 폼 제출 방지

//     try {
//       const formData = new FormData();
//       formData.append('userEmail', username);
//       formData.append('password', password);

//       const response = await axios.post('https://i10e204.p.ssafy.io/api/login', formData, {
//         withCredentials: true,
//       });

//       console.log(response);
//       console.log("------------------------");
//       console.log(response.data);
//       console.log("------------------------");
//       console.log(response.data.success);
//       console.log("------------------------");
//       console.log(response.status);

//       if (response.status === 200) {
//         const newSession = {
//           loggedIn: true,
//           sessionId: response.data.sessionId,
//           userData: response.data.loginUser, // 받아온 사용자 정보를 userData에 저장
//         };
//         setSession(newSession);

//         console.log(newSession)
        
//         // 로그인 성공 시 localStorage에 userData 저장
//         localStorage.setItem('userData', JSON.stringify(newSession));

//         console.log(localStorage.getItem('userData'));

//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         navigate('/main');
//       } else {
//         alert('id 또는 비밀번호가 틀렸습니다.');
//       }
//     } catch (error) {
//       console.error('로그인에 실패했습니다.', error);
//       alert('로그인 실패.');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleLogin();
//     }
//   };

//   return (
//     <div className='login-container'>
//       <form onSubmit={handleLogin}> {/* 폼 제출 이벤트 핸들러를 설정 */}
//           <input
//             className="logininput"
//             type="text"
//             name="userEmail"
//             placeholder="User-Email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         <br />
//           <input
//             className="logininput"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyDown={handleKeyPress}
//           />
//         <br />
//         <button className="loginbt" onClick={(e) => handleLogin(e)}> {/* type="submit"으로 변경 */}
//           로그인
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;