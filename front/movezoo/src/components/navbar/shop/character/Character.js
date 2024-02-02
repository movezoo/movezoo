// import { useState, useEffect } from 'react';
// import React from 'react';
// import './Character.css';
// import axios from 'axios';
// import blackImage from './black.png';

// function Character () {
//   const [selectedCharacter, setSelectedCharacter] = useState(null);
//   const [images, setImages] = useState([]);

//   const initialImages = [
//     { id: 1, name: '캐릭터 1', image: './1.png' },
//     { id: 2, name: '캐릭터 2', image: './2.png' },
//     { id: 3, name: '캐릭터 3', image: './3.png' },
//     { id: 4, name: '캐릭터 4', image: './4.png' },
//   ];

//   const handleCharacterClick = (character) => {
//     setSelectedCharacter(character);
//   };
  
//   useEffect(() => {
//     const fetchUserCharacters  = async () => {
//       try {
//         const response = await axios.get('https://i10e204.p.ssafy.io/api/racer/3');
//         // console.log(response.data);

//         const userCharacterIds = response.data.map(character => character.racerId);
//         // console.log(userCharacterIds);

//         const userImages = initialImages.map((image) => {
//           if (userCharacterIds.includes(image.id)) {
//             return image;
//           } else {
//             return { ...image, image: blackImage }; // 캐릭터가 없는 경우 blackImage로 대체
//           }
//         });
//         setImages(userImages);
//         // console.log(userImages);

//       } catch (error) {
//         console.error('캐릭터 정보 요청 실패:', error);
//       }
//     }
//     fetchUserCharacters ();
//   },[]);

//   return (
//     <div className='Character-container'>

//       <div className='Character-list'>
//         {images.map((character) => (
//           <div key={character.id} onClick={() => handleCharacterClick(character)}>
//             <img src={character.image} alt={character.name} />
//             <h3>{character.name}</h3>
//           </div>
//         ))}
//       </div>

//       <div className='Character-select'>
//         {selectedCharacter && (
//             <div>
//               <img src={selectedCharacter.image} alt={selectedCharacter.name} />
//               <h3>{selectedCharacter.name}</h3>
//             </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default Character;




// test_chracater_buy

import { useState, useEffect } from 'react';
import React from 'react';
import './Character.css';
import axios from 'axios';
import blackImage from './black.png';
import Modal from 'react-modal';

function Character () {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterToBuy, setCharacterToBuy] = useState(null);

  const chracterImages = [
    { id: 1, name: '캐릭터 1', image: './shop/1.png' },
    { id: 2, name: '캐릭터 2', image: './shop/2.png' },
    { id: 3, name: '캐릭터 3', image: './shop/3.png' },
    { id: 4, name: '캐릭터 4', image: './shop/4.png' },
    { id: 5, name: '캐릭터 5', image: './shop/5.png' },
    { id: 6, name: '캐릭터 6', image: './shop/6.png' },
    { id: 7, name: '캐릭터 7', image: './shop/7.png' },
    { id: 8, name: '캐릭터 8', image: './shop/8.png' },
  ];

  const noCharacterImages = [
    { id: 1, name: '캐릭터 1', image: './shop/no1.png' },
    { id: 2, name: '캐릭터 2', image: './shop/no2.png' },
    { id: 3, name: '캐릭터 3', image: './shop/no3.png' },
    { id: 4, name: '캐릭터 4', image: './shop/no4.png' },
    { id: 5, name: '캐릭터 5', image: './shop/no5.png' },
    { id: 6, name: '캐릭터 6', image: './shop/no6.png' },
    { id: 7, name: '캐릭터 7', image: './shop/no7.png' },
    { id: 8, name: '캐릭터 8', image: './shop/no8.png' },
  ];
  
  

  return (
    <div className='Character-container'>

      <div className='Character-list'>
        
      </div>

      <div className='Character-select'>
        
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="캐릭터 구매"
      >
        <h2>캐릭터를 구매하시겠습니까?</h2>
        <button>예</button>
        <button>아니오</button>
      </Modal>

    </div>
  );
};

export default Character;