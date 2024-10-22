import { useEffect, useState } from 'react';
import './App.css';
import { Character } from './types';
import { EditCharacter } from './components/EditCharacter';
import { characterApi } from './api/characterApi';

function App() {
  const [characters, setCharacters] = useState<{ [id: number]: Character }>({});

  useEffect(() => {
    characterApi
      .getCharacters()
      .then(setCharacters)
      .catch((e) => alert(e));
  }, []);

  const handleAddCharacterClick = () => {
    const id = Math.floor(Math.random() * 999999999);
    setCharacters((prev) => ({
      ...prev,
      [id]: {
        id,
        name: `Character ${id}`,
        attributes: {
          Strength: 0,
          Dexterity: 0,
          Constitution: 0,
          Intelligence: 0,
          Wisdom: 0,
          Charisma: 0,
        },
        skills: {},
      },
    }));
  };

  const handleSaveCharactersClick = () => {
    characterApi.saveCharacters(characters).catch((e) => alert(e));
  };
  const handleCharacterChange = (newCharacter: Character) => {
    setCharacters((prev) => ({
      ...prev,
      [newCharacter.id]: { ...newCharacter },
    }));
  };

  const handleCharacterDeleteClick = (id: number) => {
    const { [id]: d, ...remainingCharacters } = characters;
    setCharacters({ ...remainingCharacters });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React Coding Exercise</h1>
      </header>
      <section className='App-section'>
        <button onClick={handleAddCharacterClick}>Add character</button>
        <button onClick={handleSaveCharactersClick}>Save characters</button>
        <h2>Character List</h2>
        {Object.keys(characters).map((characterId) => {
          const character = characters[characterId];
          return (
            <EditCharacter
              key={characterId}
              character={character}
              onCharacterChange={handleCharacterChange}
              onCharacterDeleteClick={handleCharacterDeleteClick}
            />
          );
        })}
      </section>
    </div>
  );
}

export default App;
