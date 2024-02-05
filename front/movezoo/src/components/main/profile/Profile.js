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


const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);

    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    const handleImageChange = (newImage) => {
      setUserImage(newImage);
    };


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // == 쿠키 사용해서 로그인한 유저 id 가져오기 ============

        // const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        //   withCredentials: true, // 쿠키 허용
        // });
        // const UserId = loginUserId.data;


        // 유저 캐릭터 데이터 가져오기
        // const response = await axios.get(`https://i10e204.p.ssafy.io/api/racer/${UserId}`, {
        // })

        // 임시 유저 데이터
        const response = await axios.get('https://i10e204.p.ssafy.io/api/user/102');

        const user = response.data;
        setUser(user);

        const userImage = response.data.profileImgUrl;
        setUserImage(userImage)

      } catch (error) {
        console.error('유저 정보 요청 실패:', error);
      }

    }

    fetchUserInfo();
  }, []);

  return (
    <div className='profile'>
      <button className='profileButton'  onClick={openModal}>
        <img src={userImage} alt="프로필 이미지" 
        className='profileButton' onClick={openModal}/>             
      </button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      className="pofileModal"
      >
        <div className='modal-container'>

          <div className='profile-header'>
            <div className='header-name'>
              <h1>프로필 수정</h1>
            </div>
            <div className='header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>
          </div>

          <div className='profile-body'>
            <div className='body-change'>
              <ImageChange onImageChange={handleImageChange} />
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