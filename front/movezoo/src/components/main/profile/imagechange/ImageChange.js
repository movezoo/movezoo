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

const ImageChangeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onImageSelect = (image) => {
    setSelectedImage(image);
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
        {userEmail, profileImgUrl}, { withCredentials: true });

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
          <h3>이미지 변경</h3>
          <button className='exit-button' onClick={closeModal}>닫기</button>
          {profileImages.map((img) => (
            <div key={img.id} onClick={() => onImageSelect(img)}>
              <img src={img.image} alt={img.name} />
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

