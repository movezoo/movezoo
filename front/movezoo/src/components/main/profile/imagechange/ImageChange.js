// import axios from 'axios';
// import React, { useState } from 'react';
// import Modal from 'react-modal';

// const ImageChangeModal = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userEmail, setEmail] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);

//   const openModal = () => {
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const onImageChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       setSelectedImage(URL.createObjectURL(event.target.files[0]));
//     }
//   };

//   const onImageUpload = async () => {
//     try {
//       const responseLoginUserId = await axios.get('https://i10e204.p.ssafy.io/api/currentUser', {
//         withCredentials: true, // 쿠키 허용
//       });
//       const loginUserId = responseLoginUserId.data;

//       const loginUserEmail = await axios.get(`https://i10e204.p.ssafy.io/api/user/${loginUserId}`, {
//         });
//       setEmail(loginUserEmail.data.userEmail);

//       const response = await axios.post(`https://i10e204.p.ssafy.io/api/user/profile`, 
//         { userEmail, profileImgUrl }, { withCredentials: true });

//       } catch (error) {
//         console.error('이미지 변경 실패:', error);
//         alert('이미지 변경에 실패하였습니다.');
//       }
//   };

//   return (
//     <div>
//       <button className='profile-button' onClick={openModal}>이미지 변경</button>
//       <Modal 
//         isOpen={isOpen} 
//         onRequestClose={closeModal}
//         style={{
//           content: {
//             width: '500px',
//             height: '500px',
//             margin: 'auto',
//           }
//         }}
//       >
//         <div>
//           <button className='exit-button' onClick={closeModal}>닫기</button>
//           <h3>이미지 변경</h3>
//           <input type="file" onChange={onImageChange} />
//           {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100px' }} />}
//           <button onClick={onImageUpload}>변경</button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ImageChangeModal;



// test

import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageChangeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
      setSelectedFile(event.target.files[0]);
    }
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

      const formData = new FormData();
      formData.append('profileImgUrl', selectedFile);
      formData.append('userEmail', loginUserEmail.data.userEmail);

      const response = await axios.post(`https://i10e204.p.ssafy.io/api/user/profile`, 
        formData, { withCredentials: true });

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

