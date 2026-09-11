import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';

export default function ProfilePage() {
  const user = useGameStore(s => s.user);
  const localPlayer = useGameStore(s => s.localPlayer);
  const shopItems = useGameStore(s => s.shopItems);

  const ownedItems = shopItems.filter(i => i.owned);
  const ownedSkins = ownedItems.filter(i => i.category === 'skin');
  const ownedTraps = ownedItems.filter(i => i.category === 'trap');
  const ownedWeapons = ownedItems.filter(i => i.category === 'weapon');

  const stats = {
    gamesPlayed: 42,
    wins: 12,
    kills: 87,
    deaths: 30,
    swaps: 156,
    trapsPlaced: 234,
    resourcesCollected: 1024,
    playTime: '12h 34m',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500"
          >
            👤 PROFIL
          </motion.h1>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl shadow-lg shadow-blue-500/25">
              {user?.avatar || '🎮'}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white">{user?.name || 'Joueur'}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-gray-500 text-sm mt-1">Connecté via {user?.provider || 'email'}</p>
              <div className="flex gap-3 mt-3 justify-center md:justify-start">
                <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm">💰 {localPlayer?.gold || 200}</span>
                <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">💎 {localPlayer?.gems || 10}</span>
                <span className="text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm">🎟️ {localPlayer?.tokens || 5}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-white font-bold mb-3">🎨 Skins ({ownedSkins.length})</h3>
            <div className="flex flex-wrap gap-2">
              {ownedSkins.length > 0 ? ownedSkins.map(skin => (
                <span key={skin.id} className="text-2xl bg-gray-700/50 rounded-lg p-2">{skin.image}</span>
              )) : <p className="text-gray-500 text-sm">Aucun skin possédé</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-white font-bold mb-3">⚙️ Pièges ({ownedTraps.length})</h3>
            <div className="flex flex-wrap gap-2">
              {ownedTraps.length > 0 ? ownedTraps.map(trap => (
                <span key={trap.id} className="text-2xl bg-gray-700/50 rounded-lg p-2">{trap.image}</span>
              )) : <p className="text-gray-500 text-sm">Aucun piège possédé</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-white font-bold mb-3">⚔️ Armes ({ownedWeapons.length})</h3>
            <div className="flex flex-wrap gap-2">
              {ownedWeapons.length > 0 ? ownedWeapons.map(weapon => (
                <span key={weapon.id} className="text-2xl bg-gray-700/50 rounded-lg p-2">{weapon.image}</span>
              )) : <p className="text-gray-500 text-sm">Aucune arme possédée</p>}
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                <div>
                  <p className={`font-medium text-sm ${achievement.done ? 'text-green-400' : 'text-gray-400'}`}>{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.desc}</p>
                </div>
                {achievement.done && <span className="ml-auto text-green-400">✓</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
