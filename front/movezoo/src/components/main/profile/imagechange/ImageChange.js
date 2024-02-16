import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import './ImageChange.css';
import { useRecoilState } from 'recoil';
import { profileImgUrl as profileImgUrlState } from '../../../state/state';
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'react-toastify';


const profileImages = [
  { id: 1, name: '사슴', image: '/images/profileImg/profile1.png' },
  { id: 2, name: '당나귀', image: '/images/profileImg/profile2.png' },
  { id: 3, name: '여우', image: '/images/profileImg/profile3.png' },
  { id: 4, name: '허스키', image: '/images/profileImg/profile4.png' },
  { id: 5, name: '시바견', image: '/images/profileImg/profile5.png' },
  { id: 6, name: '순록', image: '/images/profileImg/profile6.png' },
  { id: 7, name: '말', image: '/images/profileImg/profile7.png' },
  { id: 8, name: '늑대', image: '/images/profileImg/profile8.png' },
]

const ImageChangeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useRecoilState(profileImgUrlState)

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onImageSelect = (image) => {
    setSelectedImage(image);
    console.log('클릭')
  };

  

  const onImageUpload = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

      // 로컬 스토리지에서 조회한 데이터를 JSON 형태로 파싱
      const userData = JSON.parse(storedUserData);

      // console.log(userData)

      // 사용자 이메일을 변수에 저장
      const userEmail = userData.userData.userEmail;

      // console.log(userEmail)

      const profileImgUrl = selectedImage.image;
      // console.log('====================================')
      // console.log(profileImgUrl);
      
      const response = await axios.patch(`https://i10e204.p.ssafy.io/api/user/profile`, 
        {userEmail, profileImgUrl},
        { withCredentials: true}
        );

      // console.log('이미지 변경 성공:', response);

      // recoil 상태 업데이트
      setProfileImgUrl(profileImgUrl);

      // 로컬 스토리지에 저장
      let updatedUserData = { ...userData };
      updatedUserData.userData.profileImgUrl = profileImgUrl;
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      toast.success('프로필 이미지가 변경되었습니다.');
      closeModal();

      } catch (error) {
        console.error('이미지 변경 실패:', error);
        toast.error('프로필 이미지 변경에 실패하였습니다.');
      }
  };

  return (
    <div>
      <button className='profile-button' onClick={openModal}>이미지 변경</button>
      <Modal 
        isOpen={isOpen} 
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)', // 투명도를 0.75로 설정한 검은색 배경
          },
          content: {
            width: '400px',
            height: '350px',
            margin: 'auto',
            borderRadius: '30px',
          }
        }}
      >
        <div className='imagechange-container'>
          <div className='header-exit'>
            <IoCloseSharp className='exit-button' onClick={closeModal} />
          </div>
          <div className='imagechange-body'>
            {profileImages.map((img) => (
              <div key={img.id} onClick={() => onImageSelect(img)}>
                <img  className={`selectImg ${selectedImage && selectedImage.id === img.id ? 'selected' : ''}`} src={img.image} alt={img.name} />
              </div>
            ))}
          </div>
          <div className='imagechange-button'>
            <button className='imagechangeButton' onClick={onImageUpload}>변경</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageChangeModal;


