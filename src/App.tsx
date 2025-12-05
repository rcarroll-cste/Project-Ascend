import { useSelector } from 'react-redux';
import { RootState } from './store';
import { DesktopLayout } from './components/os/DesktopLayout';
import { LoginScreen } from './components/scenes/LoginScreen';
import { GameOverScreen } from './components/scenes/GameOverScreen';

function App() {
  const { gameStage } = useSelector((state: RootState) => state.game);

  if (gameStage === 'Login') {
    return <LoginScreen />;
  }

  if (gameStage === 'GameOver') {
    return <GameOverScreen />;
  }

  return <DesktopLayout />;
}

export default App;