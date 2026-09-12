import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';
import { useState } from 'react';

export default function MainMenu() {
  const user = useGameStore(s => s.user);
  const isAdmin = useGameStore(s => s.isAdmin);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [roomInput, setRoomInput] = useState('');

  const handlePlayPublic = () => {
    setShowModeSelect(false);
    actions.setSelectedMap('neon-city');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
              SWAP
            </span>
            <span className="text-white mx-2">OR</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400">
              DIE
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-400 mt-3 text-sm tracking-wider uppercase"
          >
            ⚡ Échange. Construis. Survie. ⚡
          </motion.p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center gap-4 mb-8 bg-white/5 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/10"
        >
          <button
            onClick={() => actions.setPage('profile')}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
          >
            {user?.avatar || '🎮'}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{user?.username || 'Joueur'}</p>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <span className="text-yellow-400 font-medium">💰 {user?.gold || 200}</span>
              <span className="text-blue-400 font-medium">💎 {user?.gems || 10}</span>
              <span className="text-purple-400 font-medium">🎟️ {user?.tokens || 5}</span>
            </div>
          </div>
          <button
            onClick={() => actions.setPage('profile')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            →
          </button>
        </motion.div>

        {/* Main Play Button with enhanced animation */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 20px 40px -10px rgba(34, 197, 94, 0.5)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModeSelect(true)}
          className="w-full py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-xl font-black shadow-lg shadow-green-500/25 transition-all border border-white/10 mb-4 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎮
            </motion.span>
            JOUER
          </span>
        </motion.button>

        {/* Secondary Buttons with enhanced animations */}
        <div className="w-full grid grid-cols-3 gap-3 mb-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px -5px rgba(234, 179, 8, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => actions.setPage('battlepass')}
            className="py-4 px-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 backdrop-blur-sm rounded-2xl text-white font-bold shadow-lg border border-yellow-500/20 transition-all relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="relative z-10 flex flex-col items-center gap-1">
              <motion.span
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎖️
              </motion.span>
              <span className="text-sm">Pass</span>
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px -5px rgba(168, 85, 247, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => actions.setPage('shop')}
            className="py-4 px-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl text-white font-bold shadow-lg border border-white/10 transition-all relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="relative z-10 flex flex-col items-center gap-1">
              <motion.span
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🛒
              </motion.span>
              <span className="text-sm">Boutique</span>
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => actions.setPage('profile')}
            className="py-4 px-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl text-white font-bold shadow-lg border border-white/10 transition-all relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="relative z-10 flex flex-col items-center gap-1">
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                👤
              </motion.span>
              <span className="text-sm">Profil</span>
            </span>
          </motion.button>
        </div>

        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => actions.setPage('admin')}
            className="w-full py-3 px-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400 font-bold transition-all mb-4"
          >
            ⚙️ Panel Admin
          </motion.button>
        )}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => actions.logout()}
          className="mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Se déconnecter
        </motion.button>
      </div>

      {/* Mode Selection Modal */}
      {showModeSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModeSelect(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-white text-center mb-2">Choisir le mode</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Comment veux-tu jouer ?</p>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayPublic}
                className="w-full p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl text-left hover:border-green-400/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🌍</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Match Public</h3>
                    <p className="text-gray-400 text-sm">Affronte des joueurs du monde entier</p>
                    <p className="text-green-400 text-xs mt-1">Matchmaking • 2-9 joueurs</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePrivate}
                className="w-full p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl text-left hover:border-purple-400/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🔒</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Créer un salon privé</h3>
                    <p className="text-gray-400 text-sm">Joue avec tes amis en privé</p>
                    <p className="text-purple-400 text-xs mt-1">Code d'invitation • 2-9 joueurs</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowModeSelect(false);
                  setShowPrivateModal(true);
                }}
                className="w-full p-5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl text-left hover:border-blue-400/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🔑</span>
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
              className="w-full mt-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-white text-center mb-2">Rejoindre un salon</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Entre le code fourni par ton ami</p>
            
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="ABC123"
              className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-[0.3em] placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
              maxLength={6}
              autoFocus
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPrivateModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleJoinPrivate}
                disabled={roomInput.length < 4}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  roomInput.length >= 4
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
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
