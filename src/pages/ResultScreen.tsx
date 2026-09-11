import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';

export default function ResultScreen() {
  const players = useGameStore(s => s.players);
  const roundNumber = useGameStore(s => s.roundNumber);
  const localPlayer = useGameStore(s => s.localPlayer);

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isAlive && !b.isAlive) return -1;
    if (!a.isAlive && b.isAlive) return 1;
    return b.health - a.health;
  });

  const isWinner = localPlayer?.isAlive;
  const placement = sortedPlayers.findIndex(p => p.id === 'local') + 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {isWinner && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          </>
        )}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Result Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl mb-4"
          >
            {isWinner ? '🏆' : '💀'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl font-black ${isWinner ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500'}`}
          >
            {isWinner ? 'VICTOIRE !' : 'DÉFAITE'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mt-2"
          >
            {isWinner ? 'Tu es le dernier survivant !' : `Éliminé round ${roundNumber}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 inline-block bg-gray-800/80 rounded-full px-6 py-2 border border-gray-700"
          >
            <span className="text-white font-bold">#{placement}</span>
            <span className="text-gray-400 text-sm ml-2">/ {players.length} joueurs</span>
          </motion.div>
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 mb-4"
        >
          <h3 className="text-white font-bold mb-3 text-center">🎁 Récompenses</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-gray-700/30 rounded-xl p-3">
              <p className="text-yellow-400 font-bold text-xl">+{isWinner ? 500 : 100}</p>
              <p className="text-gray-400 text-xs">Or 💰</p>
            </div>
            <div className="text-center bg-gray-700/30 rounded-xl p-3">
              <p className="text-blue-400 font-bold text-xl">+{isWinner ? 20 : 5}</p>
              <p className="text-gray-400 text-xs">Gemmes 💎</p>
            </div>
            <div className="text-center bg-gray-700/30 rounded-xl p-3">
              <p className="text-purple-400 font-bold text-xl">+{isWinner ? 3 : 1}</p>
              <p className="text-gray-400 text-xs">Tokens 🎟️</p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 mb-6"
        >
          <h3 className="text-white font-bold mb-3">📊 Classement</h3>
          <div className="space-y-2">
            {sortedPlayers.slice(0, 5).map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                className={`flex items-center gap-3 p-2 rounded-xl ${player.id === 'local' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-700/20'}`}
              >
                <span className="text-lg font-bold text-gray-400 w-6">#{i + 1}</span>
                <span className="text-xl">{player.skin}</span>
                <span className={`font-medium flex-1 ${player.id === 'local' ? 'text-purple-300' : 'text-white'}`}>
                  {player.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${player.isAlive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {player.isAlive ? '✓' : '✗'}
                </span>
                <span className="text-gray-400 text-sm">{player.health} HP</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="flex gap-3"
        >
          <button
            onClick={() => actions.setPage('mapSelect')}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-green-500/25 transition-all transform hover:scale-[1.02]"
          >
            🔄 Rejouer
          </button>
          <button
            onClick={() => actions.setPage('menu')}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-300 font-bold text-lg transition-all"
          >
            🏠 Menu
          </button>
        </motion.div>
      </div>
    </div>
  );
}
