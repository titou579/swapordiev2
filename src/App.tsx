import { useGameStore } from './store/gameStore';
import LoginPage from './pages/LoginPage';
import MainMenu from './pages/MainMenu';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ResultScreen from './pages/ResultScreen';

export default function App() {
  const currentPage = useGameStore(s => s.currentPage);
  const isAuthenticated = useGameStore(s => s.isAuthenticated);
  const gameStatus = useGameStore(s => s.gameStatus);

  // Route to the correct page
  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />;
  }

  // Show result screen when game ends
  if (gameStatus === 'ended') {
    return <ResultScreen />;
  }

  switch (currentPage) {
    case 'menu':
      return <MainMenu />;
    case 'game':
      return <GamePage />;
    case 'shop':
      return <ShopPage />;
    case 'admin':
      return <AdminPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <MainMenu />;
  }
}
