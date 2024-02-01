import { useState } from 'react';
import React from 'react';
import './Character.css';

const Character = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    { id: 1, name: '캐릭터 1', image: './1.png' },
    { id: 2, name: '캐릭터 2', image: './2.png' },
    { id: 3, name: '캐릭터 3', image: './3.png' },
    { id: 4, name: '캐릭터 4', image: './4.png' },
  ];

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };
  
  return (
    <div className='Character-container'>

      <div className='Character-list'>
      {characters.map((character) => (
        <div key={character.id} onClick={() => handleCharacterClick(character)}>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
        </div>
      ))}
      </div>

      <div className='Character-select'>
        {selectedCharacter && (
            <div>
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h3>{selectedCharacter.name}</h3>
            </div>
        )}
      </div>

    </div>
);
};

export default Character;