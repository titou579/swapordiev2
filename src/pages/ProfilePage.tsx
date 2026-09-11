import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';

const AVATAR_OPTIONS = ['🎮', '🔥', '❄️', '⚡', '💀', '🦊', '🐉', '👑', '🌟', '🎭', '🦁', '🐺', '🦅', '🐍', '🎯', '🏆', '💎', '🌈', '🎪', '🚀'];

export default function ProfilePage() {
  const user = useGameStore(s => s.user);
  const localPlayer = useGameStore(s => s.localPlayer);
  const shopItems = useGameStore(s => s.shopItems);

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const ownedItems = shopItems.filter(i => i.owned);
  const ownedSkins = ownedItems.filter(i => i.category === 'skin');

  const stats = {
    gamesPlayed: user?.stats.gamesPlayed || 42,
    wins: user?.stats.wins || 12,
    kills: user?.stats.kills || 87,
    deaths: user?.stats.deaths || 30,
    swaps: user?.stats.swaps || 156,
    trapsPlaced: 234,
    resourcesCollected: 1024,
    playTime: '12h 34m',
  };

  const handleSaveUsername = () => {
    setUsernameError('');
    if (newUsername.length < 3) {
      setUsernameError('Le pseudo doit faire au moins 3 caractères');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setUsernameError('Seulement des lettres, chiffres et _');
      return;
    }
    actions.updateUsername(newUsername);
    setEditingUsername(false);
  };

  const handleSelectAvatar = (avatar: string) => {
    actions.updateAvatar(avatar);
    setShowAvatarPicker(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500"
          >
            👤 Profil
          </motion.h1>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all text-sm"
          >
            ← Retour
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarPicker(true)}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl shadow-lg shadow-blue-500/25 cursor-pointer border-4 border-white/10"
              >
                {user?.avatar || '🎮'}
              </motion.button>
              <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1.5 border-2 border-gray-900">
                <span className="text-xs">✏️</span>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              {/* Username */}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                {editingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
                      maxLength={20}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => { setEditingUsername(false); setUsernameError(''); }}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-white">{user?.username || 'Joueur'}</h2>
                    <button
                      onClick={() => { setEditingUsername(true); setNewUsername(user?.username || ''); }}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
              {usernameError && (
                <p className="text-red-400 text-xs mt-1">{usernameError}</p>
              )}
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              <p className="text-gray-500 text-xs mt-1">
                Connecté via {user?.provider === 'email' ? 'email' : user?.provider}
                {user?.createdAt && ` • Membre depuis ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`}
              </p>
              <div className="flex gap-3 mt-3 justify-center md:justify-start">
                <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-medium">💰 {localPlayer?.gold || user?.gold || 200}</span>
                <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm font-medium">💎 {localPlayer?.gems || user?.gems || 10}</span>
                <span className="text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm font-medium">🎟️ {localPlayer?.tokens || user?.tokens || 5}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Parties jouées', value: stats.gamesPlayed, icon: '🎮', color: 'text-blue-400' },
            { label: 'Victoires', value: stats.wins, icon: '🏆', color: 'text-yellow-400' },
            { label: 'Kills', value: stats.kills, icon: '⚔️', color: 'text-red-400' },
            { label: 'K/D Ratio', value: (stats.kills / Math.max(1, stats.deaths)).toFixed(2), icon: '📊', color: 'text-green-400' },
            { label: 'Swaps survécus', value: stats.swaps, icon: '🔄', color: 'text-purple-400' },
            { label: 'Pièges posés', value: stats.trapsPlaced, icon: '⚙️', color: 'text-orange-400' },
            { label: 'Ressources', value: stats.resourcesCollected, icon: '💎', color: 'text-cyan-400' },
            { label: 'Temps de jeu', value: stats.playTime, icon: '⏱️', color: 'text-pink-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 text-center"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-6"
        >
          <h3 className="text-white font-bold mb-4">🎨 Collection de Skins ({ownedSkins.length})</h3>
          <div className="flex flex-wrap gap-3">
            {ownedSkins.length > 0 ? ownedSkins.map(skin => (
              <div key={skin.id} className="text-3xl bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer">
                {skin.image}
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Aucun skin possédé. Visite la boutique pour en obtenir !</p>
            )}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-white font-bold mb-4">🏅 Succès</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Premier Swap', desc: 'Survivre à votre premier swap', done: true, icon: '🔄' },
              { name: 'Piégeur', desc: 'Poser 10 pièges', done: true, icon: '⚙️' },
              { name: 'Collecteur', desc: 'Collecter 100 ressources', done: true, icon: '💎' },
              { name: 'Survivant', desc: 'Gagner une partie', done: false, icon: '🏆' },
              { name: 'Serial Killer', desc: 'Éliminer 50 joueurs', done: false, icon: '💀' },
              { name: 'Milliardaire', desc: 'Accumuler 10000 or', done: false, icon: '💰' },
            ].map((achievement, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${achievement.done ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-700/30 border border-gray-600/30'}`}>
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${achievement.done ? 'text-green-400' : 'text-gray-400'}`}>{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.desc}</p>
                </div>
                {achievement.done && <span className="text-green-400">✓</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gray-900 rounded-3xl p-8 border border-gray-700 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white text-center mb-6">Choisir un avatar</h2>
              <div className="grid grid-cols-5 gap-3">
                {AVATAR_OPTIONS.map(avatar => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`text-3xl p-3 rounded-xl transition-all ${
                      user?.avatar === avatar
                        ? 'bg-purple-600/30 border-2 border-purple-500'
                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
