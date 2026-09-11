import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';
import { useState } from 'react';

export default function MainMenu() {
  const user = useGameStore(s => s.user);
  const isAdmin = useGameStore(s => s.isAdmin);
  const localPlayer = useGameStore(s => s.localPlayer);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [roomInput, setRoomInput] = useState('');

  const handlePlayPublic = () => {
    setShowModeSelect(false);
    actions.setSelectedMap('neon-city'); // Default, will be chosen in map select
    actions.setGameMode('public');
    actions.setPage('mapSelect');
  };

  const handleCreatePrivate = () => {
    setShowModeSelect(false);
    actions.setSelectedMap('neon-city');
    actions.setGameMode('private');
    actions.setPage('mapSelect');
  };

  const handleJoinPrivate = () => {
    if (roomInput.length >= 4) {
      setShowPrivateModal(false);
      actions.setRoomCode(roomInput.toUpperCase());
      actions.setSelectedMap('neon-city');
      actions.setGameMode('private');
      actions.setPage('mapSelect');
    }
  };

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

        {/* Play Button - Main CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModeSelect(true)}
          className="w-full max-w-sm py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-2xl font-black shadow-lg shadow-green-500/30 transition-all duration-200 border border-white/10 mb-4"
        >
          🎮 JOUER
        </motion.button>

        {/* Other buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => actions.setPage('shop')}
            className="w-full py-3 px-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl text-white text-lg font-bold shadow-lg shadow-purple-500/25 transition-all border border-white/10"
          >
            🛒 Boutique
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => actions.setPage('profile')}
            className="w-full py-3 px-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl text-white text-lg font-bold shadow-lg shadow-blue-500/25 transition-all border border-white/10"
          >
            👤 Profil
          </motion.button>

          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, type: 'spring' }}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => actions.setPage('admin')}
              className="w-full py-3 px-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl text-white text-lg font-bold shadow-lg shadow-red-500/25 transition-all border border-white/10"
            >
              ⚙️ Admin
            </motion.button>
          )}
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
      </div>

      {/* Mode Selection Modal */}
      {showModeSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModeSelect(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900 rounded-3xl p-8 border border-gray-700 max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-white text-center mb-6">Choisir le mode</h2>
            
            <div className="space-y-4">
              {/* Public Match */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayPublic}
                className="w-full p-5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 rounded-2xl text-left hover:border-green-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🌍</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Match Public</h3>
                    <p className="text-gray-400 text-sm">Affronte des joueurs du monde entier</p>
                    <p className="text-green-400 text-xs mt-1">Matchmaking automatique • 2-9 joueurs</p>
                  </div>
                </div>
              </motion.button>

              {/* Private Room */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePrivate}
                className="w-full p-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl text-left hover:border-purple-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🔒</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Créer un salon privé</h3>
                    <p className="text-gray-400 text-sm">Joue avec tes amis en privé</p>
                    <p className="text-purple-400 text-xs mt-1">Code d'invitation • 2-9 joueurs</p>
                  </div>
                </div>
              </motion.button>

              {/* Join Private Room */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowModeSelect(false);
                  setShowPrivateModal(true);
                }}
                className="w-full p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-2 border-blue-500/50 rounded-2xl text-left hover:border-blue-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🔑</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Rejoindre un salon</h3>
                    <p className="text-gray-400 text-sm">Entre le code de ton ami</p>
                    <p className="text-blue-400 text-xs mt-1">Code à 6 caractères</p>
                  </div>
                </div>
              </motion.button>
            </div>

            <button
              onClick={() => setShowModeSelect(false)}
              className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Join Private Room Modal */}
      {showPrivateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900 rounded-3xl p-8 border border-gray-700 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-white text-center mb-2">Rejoindre un salon</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Entre le code fourni par ton ami</p>
            
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABC123"
              className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
              maxLength={6}
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPrivateModal(false)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleJoinPrivate}
                disabled={roomInput.length < 4}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  roomInput.length >= 4
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Rejoindre
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
