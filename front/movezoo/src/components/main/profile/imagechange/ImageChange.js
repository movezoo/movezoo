import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import './ImageChange.css';

const profileImages = [
  { id: 1, name: '프로필 1', image: './profileImg/profile1.png' },
  { id: 2, name: '프로필 2', image: './profileImg/profile2.png' },
  { id: 3, name: '프로필 3', image: './profileImg/profile3.png' },
  { id: 4, name: '프로필 4', image: './profileImg/profile4.png' },
  { id: 5, name: '프로필 5', image: './profileImg/profile5.png' },
  { id: 6, name: '프로필 6', image: './profileImg/profile6.png' },
  { id: 7, name: '프로필 7', image: './profileImg/profile7.png' },
  { id: 8, name: '프로필 8', image: './profileImg/profile8.png' },
]

const ImageChangeModal = ({ onImageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

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
      const responseLoginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        withCredentials: true, // 쿠키 허용
      });
      const loginUserId = responseLoginUserId.data;


      const loginUserEmail = await axios.get(`https://i10e204.p.ssafy.io/api/user/${loginUserId}`, {
        });
      setEmail(loginUserEmail.data.userEmail);

      const profileImgUrl = selectedImage.image;
      console.log('====================================')
      console.log(profileImgUrl);
      
      const response = await axios.patch(`https://i10e204.p.ssafy.io/api/user/profile`, 
        {userEmail, profileImgUrl},
        { withCredentials: true}
        );

      onImageChange(profileImgUrl);

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


