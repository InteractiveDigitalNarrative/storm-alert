// App.jsx - Main application component

// STEP 1: IMPORT
import { useState } from 'react';  // Import useState hook
import Menu from './components/Menu.jsx';  // Import our Menu component
import InkStory from './components/InkStory.jsx';  // Import InkStory component
import './App.css';

function App() {
  // STEP 2: STATE MANAGEMENT
  // Track which screen to show: 'menu' or 'game'
  const [currentScreen, setCurrentScreen] = useState('menu');

  // Track if there's a saved game (for now, false)
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // STEP 3: EVENT HANDLERS
  // These functions are passed to Menu as props

  const handleStartGame = () => {
    console.log('Start game clicked!');
    setCurrentScreen('game');  // Switch to game screen
    // Later we'll actually start the game here
  };

  const handleContinueGame = () => {
    console.log('Continue game clicked!');
    setCurrentScreen('game');  // Switch to game screen
    // Later we'll load saved game here
  };

  // STEP 4: RENDER
  return (
    <div className="App">
      {/* CONDITIONAL RENDERING: Show different screens based on state */}

      {currentScreen === 'menu' && (
        <Menu
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          hasSavedGame={hasSavedGame}
        />
      )}

      {currentScreen === 'game' && (
        <InkStory />
      )}
    </div>
  );
}

export default App;
