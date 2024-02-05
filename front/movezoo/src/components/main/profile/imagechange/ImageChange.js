// import React from 'react';
// import Modal from 'react-modal';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';

// const LogoutModal = () => {
//   const [isOpen, setIsOpen] = useState(false);
  

//   const openModal = () => {
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

  

//   return (
//     <div>
//       <button className='profile-button' onClick={openModal}>이미지 변경</button>

//       <Modal 
//       isOpen={isOpen} 
//       onRequestClose={closeModal}
//       style={{
//         content: {
//           width: '500px',
//           height: '500px',
//           margin: 'auto',
//         }
//       }}>
//         <div>
//           <button className='exit-button' onClick={closeModal}>닫기</button>
//           <h3>이미지 변경</h3>
          
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default LogoutModal;




// test
import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageChangeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onImageUpload = async () => {
    try {
      const loginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
        withCredentials: true, // 쿠키 허용
      });
      const userId = loginUserId.data;

      const formData = new FormData();
      formData.append('profileImgUrl', selectedImage);

      const response = await axios.post(`https://i10e204.p.ssafy.io/api/user/${userId}`, 
        formData, 
        { withCredentials: true });
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
        style={{
          content: {
            width: '500px',
            height: '500px',
            margin: 'auto',
          }
        }}
      >
        <div>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          <h3>이미지 변경</h3>
          <input type="file" onChange={onImageChange} />
          {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100px' }} />}
          <button onClick={onImageUpload}>변경</button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageChangeModal;

