import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';

export default function MainMenu() {
  const user = useGameStore(s => s.user);
  const isAdmin = useGameStore(s => s.isAdmin);
  const localPlayer = useGameStore(s => s.localPlayer);

  const menuItems = [
    { label: '🎮 Jouer', action: () => actions.startGame(), color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30' },
    { label: '🛒 Boutique', action: () => actions.setPage('shop'), color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' },
    { label: '👤 Profil', action: () => actions.setPage('profile'), color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/30' },
  ];

  if (isAdmin) {
    menuItems.push({ label: '⚙️ Admin', action: () => actions.setPage('admin'), color: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/30' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{ x: Math.random() * 1200, y: Math.random() * 800 }}
          animate={{
            y: [Math.random() * 800, Math.random() * 800],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight">
            SWAP OR DIE
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-400 mt-2 text-lg"
          >
            ⚡ Échange. Construis. Survie. ⚡
          </motion.p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-8 bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-700/50"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
            {user?.avatar || '🎮'}
          </div>
          <div>
            <p className="text-white font-bold">{user?.name || 'Joueur'}</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-yellow-400">💰 {localPlayer?.gold || 200}</span>
              <span className="text-blue-400">💎 {localPlayer?.gems || 10}</span>
              <span className="text-purple-400">🎟️ {localPlayer?.tokens || 5}</span>
            </div>
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.action}
              className={`w-full py-4 px-8 bg-gradient-to-r ${item.color} rounded-2xl text-white text-xl font-bold shadow-lg ${item.shadow} transition-all duration-200 border border-white/10`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => actions.logout()}
          className="mt-8 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Se déconnecter
        </motion.button>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-gray-500 text-xs max-w-md"
        >
          <p>🔄 Swap toutes les 90 secondes • ⚔️ Construis des pièges • 💀 Élimine tes adversaires</p>
          <p className="mt-1">🏆 Le dernier survivant remporte la partie !</p>
        </motion.div>
      </div>
    </div>
  );
}
