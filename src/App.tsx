import { useSelector } from 'react-redux';
import { RootState } from './store';
import { DesktopLayout } from './components/os/DesktopLayout';
import { LoginScreen } from './components/scenes/LoginScreen';

function App() {
  const { gameStage } = useSelector((state: RootState) => state.game);

  return (
    <>
      {gameStage === 'Login' ? (
        <LoginScreen />
      ) : (
        <DesktopLayout />
      )}
    </>
  );
}

export default App