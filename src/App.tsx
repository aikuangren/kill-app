import React from 'react';
import { useGameStore } from './hooks/useGameStore';
import HomePage from './pages/HomePage';
import GameMap from './components/game/GameMap';
import QuizGame from './components/game/QuizGame';

function App() {
  const { gameState } = useGameStore();

  const renderCurrentPage = () => {
    switch (gameState) {
      case 'home':
        return <HomePage />;
      case 'map':
        return <GameMap />;
      case 'quiz':
        return <QuizGame />;
      default:
        return <HomePage />;
    }
  };

  
  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
