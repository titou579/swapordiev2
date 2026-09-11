import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';
import { getMapById } from '../data/maps';

export default function LobbyPage() {
  const selectedMap = useGameStore(s => s.selectedMap);
  const gameMode = useGameStore(s => s.gameMode);
  const roomCode = useGameStore(s => s.roomCode);
  const lobbyPlayers = useGameStore(s => s.lobbyPlayers);
  const lobbyCountdown = useGameStore(s => s.lobbyCountdown);
  const lobbyStatus = useGameStore(s => s.lobbyStatus);

  const mapData = selectedMap ? getMapById(selectedMap) : null;
  const [copied, setCopied] = useState(false);

  // Simulate players joining
  useEffect(() => {
    if (lobbyStatus !== 'waiting') return;
    const interval = setInterval(() => {
      const currentPlayers = useGameStore(s => s.lobbyPlayers);
      if (currentPlayers.length < 9 && Math.random() > 0.5) {
        actions.addLobbyPlayer();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [lobbyStatus]);

  // Countdown when enough players
  useEffect(() => {
    if (lobbyStatus !== 'countdown') return;
    const interval = setInterval(() => {
      const current = useGameStore(s => s.lobbyCountdown);
      if (current <= 1) {
        actions.startGameFromLobby();
      } else {
        actions.updateLobbyCountdown(-1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lobbyStatus]);

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard?.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStart = () => {
    if (lobbyPlayers.length >= 2) {
      actions.setLobbyStatus('countdown');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🏟️ SALON D'ATTENTE
            </motion.h1>
            <p className="text-gray-400 mt-1">
              {gameMode === 'private' ? `Salon privé #${roomCode}` : 'Matchmaking public'}
              {mapData && ` • ${mapData.emoji} ${mapData.name}`}
            </p>
          </div>
          <button
            onClick={() => {
              actions.setLobbyStatus('waiting');
              actions.setPage('menu');
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
          >
            ← Quitter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50"
          >
            {mapData && (
              <>
                <div
                  className="h-48 relative"
                  style={{ background: `linear-gradient(135deg, ${mapData.theme.skyColor}, ${mapData.theme.groundColor})` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl">{mapData.emoji}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-2xl font-bold text-white">{mapData.name}</h2>
                    <p className="text-gray-300 text-sm">{mapData.description}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-700/30 rounded-xl p-3">
                    <p className="text-purple-400 font-bold text-lg">{mapData.structures.length}</p>
                    <p className="text-gray-400 text-xs">Structures</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-3">
                    <p className="text-yellow-400 font-bold text-lg">{mapData.resources.reduce((a, r) => a + r.count, 0)}</p>
                    <p className="text-gray-400 text-xs">Ressources</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-3">
                    <p className="text-green-400 font-bold text-lg capitalize">{mapData.difficulty}</p>
                    <p className="text-gray-400 text-xs">Difficulté</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Players & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Room Code (private) */}
            {gameMode === 'private' && roomCode && (
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Code du salon</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold text-white flex-1">{roomCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-medium transition-all"
                  >
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">Partage ce code avec tes amis</p>
              </div>
            )}

            {/* Players list */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold">Joueurs</p>
                <span className="text-gray-400 text-sm">{lobbyPlayers.length}/9</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {lobbyPlayers.map((player: { id: string; name: string; avatar: string; isBot: boolean; isReady: boolean }, i: number) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-gray-700/30 rounded-xl p-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                        {player.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{player.name}</p>
                        <p className="text-gray-500 text-xs">
                          {player.isBot ? '🤖 Bot' : player.id === 'local' ? '👑 Vous' : '👤 Joueur'}
                        </p>
                      </div>
                      {player.isReady && (
                        <span className="text-green-400 text-xs">✓ Prêt</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Empty slots */}
                {Array.from({ length: 9 - lobbyPlayers.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-3 bg-gray-700/10 rounded-xl p-2 border border-dashed border-gray-700/30">
                    <div className="w-8 h-8 rounded-full bg-gray-700/30 flex items-center justify-center text-gray-600 text-sm">
                      ?
                    </div>
                    <p className="text-gray-600 text-sm">En attente...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              {lobbyStatus === 'waiting' && (
                <>
                  <div className="text-center mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-gray-400"
                    >
                      {lobbyPlayers.length < 2 ? (
                        <p className="text-sm">En attente de joueurs...</p>
                      ) : (
                        <p className="text-sm text-green-400">Assez de joueurs ! Prêt à lancer ?</p>
                      )}
                    </motion.div>
                  </div>
                  <button
                    onClick={handleStart}
                    disabled={lobbyPlayers.length < 2}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                      lobbyPlayers.length >= 2
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {lobbyPlayers.length >= 2 ? '🚀 Lancer la partie' : '⏳ En attente...'}
                  </button>
                </>
              )}

              {lobbyStatus === 'countdown' && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">La partie commence dans</p>
                  <motion.p
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {lobbyCountdown}
                  </motion.p>
                  <p className="text-gray-500 text-xs mt-2">Préparez-vous au combat !</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
