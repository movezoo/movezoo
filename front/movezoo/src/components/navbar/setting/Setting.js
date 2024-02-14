import React, { useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import './Setting.css';

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = React.useState(20);
  const [isMuted, setIsMuted] = React.useState(false);

  const handleMute = () => {
    setIsMuted(!isMuted);
    const audioElement = document.getElementById("background-audio");
    audioElement.volume = isMuted ? 1 : 0; // 음소거 상태에 따라 볼륨을 조절합니다.
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
