import { useSelector } from 'react-redux';
import { RootState } from './store';
import { DesktopLayout } from './components/os/DesktopLayout';
import { LoginScreen } from './components/scenes/LoginScreen';
import { GameOverScreen } from './components/scenes/GameOverScreen';
import { LevelCompleteScreen } from './components/scenes/LevelCompleteScreen';
import { EndingScreen } from './components/scenes/EndingScreen';
import { ExamSimScreen } from './components/scenes/ExamSimScreen';
import {
  HRPortalScreen,
  AvatarSelectionScreen,
  BadgeGenerationScreen,
} from './components/scenes/onboarding';
import {
  FalseStartEnding,
  PaperPusherEnding,
  InitiatorEnding,
} from './components/scenes/endings';
import { selectDemoEnding } from './features/playerSlice';

function App() {
  const { gameStage, currentLevelId, pendingExamLevel } = useSelector((state: RootState) => state.game);
  const onboardingStage = useSelector((state: RootState) => state.player.onboardingStage);
  const demoEnding = useSelector(selectDemoEnding);

  // Onboarding flow (before Login)
  if (gameStage === 'Boot' || gameStage === 'Login') {
    // Show onboarding screens based on player progress
    if (onboardingStage === 'hr_portal') {
      return <HRPortalScreen />;
    }
    if (onboardingStage === 'avatar_select') {
      return <AvatarSelectionScreen />;
    }
    if (onboardingStage === 'badge_gen') {
      return <BadgeGenerationScreen />;
    }
    // If onboarding complete but still at Login stage, show legacy login
    return <LoginScreen />;
  }

  // Game Over screen
  if (gameStage === 'GameOver') {
    return <GameOverScreen />;
  }

  // ExamSim screen (post-level assessment)
  if (gameStage === 'ExamSim' && pendingExamLevel !== null) {
    return <ExamSimScreen levelId={pendingExamLevel} />;
  }

  // Level Complete transition screen
  if (gameStage === 'LevelComplete') {
    return <LevelCompleteScreen />;
  }

  // Game Ending screen (Demo endings based on player performance)
  if (gameStage === 'Ending') {
    // For demo, show the appropriate ending based on player metrics
    switch (demoEnding) {
      case 'false_start':
        return <FalseStartEnding />;
      case 'paper_pusher':
        return <PaperPusherEnding />;
      case 'initiator':
        return <InitiatorEnding />;
      default:
        return <EndingScreen />;
    }
  }

  // Main desktop gameplay
  return <DesktopLayout />;
}

export default App;
