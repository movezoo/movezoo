import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import './ImageChange.css';
import { useRecoilState } from 'recoil';
import { profileImgUrl as profileImgUrlState } from '../../../state/state';


const profileImages = [
  { id: 1, name: '프로필 1', image: '/images/profileImg/profile1.png' },
  { id: 2, name: '프로필 2', image: '/images/profileImg/profile2.png' },
  { id: 3, name: '프로필 3', image: '/images/profileImg/profile3.png' },
  { id: 4, name: '프로필 4', image: '/images/profileImg/profile4.png' },
  { id: 5, name: '프로필 5', image: '/images/profileImg/profile5.png' },
  { id: 6, name: '프로필 6', image: '/images/profileImg/profile6.png' },
  { id: 7, name: '프로필 7', image: '/images/profileImg/profile7.png' },
  { id: 8, name: '프로필 8', image: '/images/profileImg/profile8.png' },
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

      console.log(userData)

      // 사용자 이메일을 변수에 저장
      const userEmail = userData.userEmail;

      console.log(userEmail)

      const profileImgUrl = selectedImage.image;
      console.log('====================================')
      console.log(profileImgUrl);
      
      const response = await axios.patch(`https://i10e204.p.ssafy.io/api/user/profile`, 
        {userEmail, profileImgUrl},
        { withCredentials: true}
        );

      console.log('이미지 변경 성공:', response);

      // recoil 상태 업데이트
      setProfileImgUrl(profileImgUrl);

      // 로컬 스토리지에 저장
      const updatedUserData = { ...userData, profileImgUrl };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      alert('이미지가 변경되었습니다.');
      closeModal();

      } catch (error) {
        console.error('이미지 변경 실패:', error);
        alert('이미지 변경에 실패하였습니다.');
      }
  };

  return (
    <div>
      <button className='profile-button' onClick={openModal}>이미지 변경</button>
      <Modal 
        isOpen={isOpen} 
        onRequestClose={closeModal}
        className="ImageChangeModal"
      >
        <div className='imagechange-container'>
          <h3>이미지 변경</h3>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          {profileImages.map((img) => (
            <div key={img.id} onClick={() => onImageSelect(img)}>
              <img  className={`selectImg ${selectedImage && selectedImage.id === img.id ? 'selected' : ''}`} src={img.image} alt={img.name} />
              <p>{img.name}</p>
            </div>
          ))}
          <button onClick={onImageUpload}>변경</button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageChangeModal;


