import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ImageChange from './imagechange/ImageChange';
import NicknameChange from './nicknamechange/NicknameChange';
import PasswordChange from './passwordchange/PasswordChange';
import LogoutModal from './logout/Logout';
import './Profile.css';
import axios from 'axios';
// import profile from './imagechange/profile1.png';
import { IoCloseSharp } from "react-icons/io5";


const Profile = ({ isProfileOpen, isProfileClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);

    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };




  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

  //       // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
  //       //   withCredentials: true, // 쿠키 허용
  //       // });
  //       // const UserId = loginUserId.data;

  //       // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {})

  //       // 임시 유저 데이터==
  //       const response = await axios.get('https://i10e204.p.ssafy.io/api/user/103');

  //       const user = response.data;
  //       setUser(user);
  //       // setNickname(user.nickname); 

  //       const userImage = response.data.profileImgUrl;
  //       setUserImage(userImage)

  //     } catch (error) {
  //       console.error('유저 정보 요청 실패:', error);
  //     }

  //   }

  //   fetchUserInfo();
  // }, []);

  return (
    <div className='profile'>
      {/* <div>
       
        <img src={userImage} alt="프로필 이미지" 
        className='profileButton' onClick={openModal}/>   
        { nickname }          
        
      </div> */}

      <Modal 
      isOpen={isProfileOpen} 
      onRequestClose={isProfileClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // 투명도를 0.75로 설정한 검은색 배경
        },
        content: {
          width: '300px',
          height: '350px',
          margin: 'auto',
          borderRadius: '30px',
        }
      }}
      >
        <div className='modal-container'>

          <div className='profile-header'>
            <div className='header-name'>
              
            </div>
            <div className='header-exit'>
              <IoCloseSharp className='exit-button' onClick={isProfileClose} />
            </div>
          </div>

          <div className='profile-body'>
            <div className='body-change'>
              <ImageChange/>
              <NicknameChange/>
              <PasswordChange/>
              <LogoutModal/>
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default Profile;