import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import './Setting.css';

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = React.useState(20);
  const [isMuted, setIsMuted] = React.useState(false);


  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setIsMuted(userData.isMuted); 
    }
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      userData.isMuted = isMuted; 
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [isMuted]);

  const handleMute = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);

    const audioElement = document.getElementById("background-audio");
    audioElement.muted = newMuteStatus; 
  };


  return (
    <div className='setting'>
      <div className='setting-button-container' onClick={handleMute}> {/* onClick 이벤트를 handleMute로 변경했습니다. */}
        {
          isMuted ? 
            <FaVolumeMute className='settingButton' /> : // 음소거 아이콘이 보입니다.
            <FaVolumeUp className='settingButton' /> // 소리 아이콘이 보입니다.
        }
      </div>
    </div>

  );
};

export default Setting;
