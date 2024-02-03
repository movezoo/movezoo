// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import ImageChange from './ImageChange';
// import NicknameChange from './NicknameChange';
// import PasswordChange from './PasswordChange';
// import LogoutModal from './Logout';
// import './Profile.css';
// import axios from 'axios';


// const Profile = () => {
//   const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
//   const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
//   const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUserInfo] = useState(null);

//   const openModal = () => {
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const openEditNicknameModal = () => {
//     setIsEditNicknameOpen(true);
//   };

//   const closeEditNicknameModal = () => {
//     setIsEditNicknameOpen(false);
//   };

//   const openEditPasswordModal = () => {
//     setIsEditPasswordOpen(true);
//   };

//   const closeEditPasswordModal = () => {
//     setIsEditPasswordOpen(false);
//   };

//   const openChangeImageModal = () => { 
//     setIsChangeImageModalOpen(true);
//   };

//   const closeChangeImageModal = () => { 
//     setIsChangeImageModalOpen(false);
//   };

//   // 닉네임 변경 
//   const saveNewNickname = () => {
//     closeEditNicknameModal();
//   };

//   // 비밀번호 변경
//   const saveNewPassword = () => {
//     closeEditPasswordModal();
//   };

//   const saveNewImage = () => {
//     closeChangeImageModal();
//   };

//   const handleLogout = () => {
//     // 로그아웃 기능을 수행하는 코드 작성
//     // 예를 들어, 세션을 종료하고 홈 화면으로 이동하는 로직을 구현할 수 있습니다.
//     // 이 부분은 애플리케이션의 요구사항에 따라 다를 수 있습니다.
//   };

//   useEffect(() => {
//     const fetchUserInfo = async (userId) => {
//       try {
//         const response = await axios.get(`https://i10e204.p.ssafy.io/api/user/${userId}`);
//         // console.log(response.data);
//         const userInfo = response.data;
//         setUserInfo(userInfo)
//       } catch (error) {
//         console.error('유저 정보 요청 실패:', error);
//       }

//     }

//     fetchUserInfo(102);
//   }, []);

//   return (
//     <div>
//       <button  onClick={openModal}>
//         {user && user.profileImgUrl ? (
//           <img src={user.profileImgUrl} alt="프로필 이미지" />) 
//           : (<img src="/path/to/default-profile-image.png" alt="기본 프로필 이미지" />
//           )}
//       </button>

//       <Modal 
//       isOpen={isOpen} 
//       onRequestClose={closeModal}
//       style={{
//         content: {
//           width: '300px',
//           height: '300px',
//           margin: 'auto',
//         }
//       }}
//       >
//         <div>
//           <button className='exit-button' onClick={closeModal}>닫기</button>

//           <div>
//             <div>
//             <button  onClick={openChangeImageModal}>
//               {user && user.profileImgUrl ? (
//                 <img src={user.profileImgUrl} alt="프로필 이미지" />) 
//                 : (<img src="/path/to/default-profile-image.png" alt="기본 프로필 이미지" />
//                 )}
//             </button>
//             </div>
//             <div>
//               <h1>{user && user.nickname}</h1>
//             </div>
//           </div>

//           <div>
//             <div>
//               <h3>Coin</h3>
//             </div>
//             <div>
//               {user && user.coin}
//             </div>
//           </div>

//           <div>
//             <div>
//               <button className='profile-button' onClick={openEditNicknameModal}>닉네임 변경</button>
//             </div>
//             <div>
//               <button className='profile-button' onClick={openEditPasswordModal}>비밀번호 변경</button>
//             </div>
//             <div>
//               <button className='profile-button' onClick={() => setIsLogoutModalOpen(true)}>로그아웃</button>
//             </div>
//           </div>
          
        
//         </div>
//       </Modal>

//       <ImageChange
//         isOpen={isChangeImageModalOpen}
//         onRequestClose={closeChangeImageModal}
//         onSave={saveNewImage}
//       />

//       <NicknameChange
//         isOpen={isEditNicknameOpen}
//         onRequestClose={closeEditNicknameModal}
//         onSave={saveNewNickname}
//       />

//       <PasswordChange
//         isOpen={isEditPasswordOpen}
//         onRequestClose={closeEditPasswordModal}
//         onSave={saveNewPassword}
//       />

//       <LogoutModal
//         isOpen={isLogoutModalOpen}
//         onRequestClose={() => setIsLogoutModalOpen(false)}
//         onLogout={handleLogout}
//       />

//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ImageChange from './imagechange/ImageChange';
import NicknameChange from './nicknamechange/NicknameChange';
import PasswordChange from './passwordchange/PasswordChange';
import LogoutModal from './logout/Logout';
import './Profile.css';
import axios from 'axios';
import { Log } from '@tensorflow/tfjs-core';


const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUserInfo] = useState(null);

    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };


  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

        // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        //   withCredentials: true, // 쿠키 허용
        // });
        // const UserId = loginUserId.data;

        // ====================================================

        // 유저 캐릭터 데이터 가져오기
        // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {
        // })

        // 임시 유저 데이터
        const response = await axios.get('https://i10e204.p.ssafy.io/api/user/102');
        

        const userInfo = response.data;
        setUserInfo(userInfo)
      } catch (error) {
        console.error('유저 정보 요청 실패:', error);
      }

    }

    fetchUserInfo(102);
  }, []);

  return (
    <div>
      <button  onClick={openModal}>
        프로필              
      </button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '500px',
          height: '500px',
          margin: 'auto',
        }
      }}
      >
        <div>

          <div>
            <h1>프로필</h1>
            <button className='exit-button' onClick={closeModal}>닫기</button>
          </div>

          <div>
            <div>
              <h3>Coin</h3>
            </div>
            <div>
              {user && user.coin}
            </div>
          </div>


          <div>
            <ImageChange/>
            <NicknameChange/>
            <PasswordChange/>
            <LogoutModal/>
          </div>
          
        
        </div>
      </Modal>

    </div>
  );
};

export default Profile;