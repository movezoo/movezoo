import React, { useState } from 'react';
import Modal from 'react-modal';

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = React.useState(80);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
  };

  React.useEffect(() => {
    const audioElement = document.getElementById("background-audio");
    audioElement.volume = volume / 100;
  }, [volume]);


  return (
    <div>
      <button onClick={openModal}>설정</button>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        content: {
          width: '1000px',
          height: '500px',
          margin: 'auto',
        }
      }}
      >
        <h1>설정</h1>

        <h3>배경 음악 조절</h3>
        <div>
          <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
        </div>
        
        <hr/>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Setting;
