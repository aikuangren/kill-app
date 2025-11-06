import { useGameStore } from './hooks/useGameStore';
import SetupPage from './pages/SetupPage';
import HomePage from './pages/HomePage';
import GameMap from './components/game/GameMap';
import QuizGame from './components/game/QuizGame';

function App() {
  const { gameState } = useGameStore();

  const renderCurrentPage = () => {
    switch (gameState) {
      case 'setup':
        return <SetupPage />;
      case 'home':
        return <HomePage />;
      case 'map':
        return <GameMap />;
      case 'quiz':
        return <QuizGame />;
      default:
        return <SetupPage />;
    }
  };

  
  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
