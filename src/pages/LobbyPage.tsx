import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';
import { getMapById } from '../data/maps';
import { useState } from 'react';

export default function LobbyPage() {
  const selectedMap = useGameStore(s => s.selectedMap);
  const gameMode = useGameStore(s => s.gameMode);
  const roomCode = useGameStore(s => s.roomCode);
  const lobbyPlayers = useGameStore(s => s.lobbyPlayers);
  const lobbyCountdown = useGameStore(s => s.lobbyCountdown);
  const lobbyStatus = useGameStore(s => s.lobbyStatus);
  const [copied, setCopied] = useState(false);

  const mapData = selectedMap ? getMapById(selectedMap) : null;
  
  // Refs pour éviter les problèmes de closure
  const joinIntervalRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const lobbyCountdownRef = useRef(lobbyCountdown);
  const lobbyPlayersRef = useRef(lobbyPlayers);
  
  // Keep refs in sync
  useEffect(() => {
    lobbyCountdownRef.current = lobbyCountdown;
    lobbyPlayersRef.current = lobbyPlayers;
  }, [lobbyCountdown, lobbyPlayers]);

  // Unified lobby logic
  useEffect(() => {
    // Clean up all intervals on unmount or status change
    if (joinIntervalRef.current) {
      clearInterval(joinIntervalRef.current);
      joinIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (lobbyStatus === 'waiting') {
      // Start adding players
      joinIntervalRef.current = window.setInterval(() => {
        // Use ref to get current value without stale closure
        const currentPlayers = lobbyPlayersRef.current;
        
        // Stop if max players
        if (currentPlayers.length >= 9) {
          if (joinIntervalRef.current) {
            clearInterval(joinIntervalRef.current);
            joinIntervalRef.current = null;
          }
          return;
        }
        
        // 60% chance to add a player
        if (Math.random() < 0.6) {
          actions.addLobbyPlayer();
        }
      }, 2000);
    }

    if (lobbyStatus === 'countdown') {
      // Start countdown
      countdownIntervalRef.current = window.setInterval(() => {
        // Use ref to get current value without stale closure
        const currentCountdown = lobbyCountdownRef.current;
        
        if (currentCountdown <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          actions.startGameFromLobby();
        } else {
          actions.updateLobbyCountdown(-1);
        }
      }, 1000);
    }

    // Cleanup on unmount
    return () => {
      if (joinIntervalRef.current) {
        clearInterval(joinIntervalRef.current);
        joinIntervalRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [lobbyStatus]); // Only depend on lobbyStatus

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard?.writeText(roomCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStart = () => {
    if (lobbyPlayers.length >= 2) {
      // Stop player joining immediately
      if (joinIntervalRef.current) {
        clearInterval(joinIntervalRef.current);
        joinIntervalRef.current = null;
      }
      // Reset countdown to 10
      actions.setLobbyCountdown(10);
      // Start countdown
      actions.setLobbyStatus('countdown');
    }
  };

  const handleLeave = () => {
    // Clean up intervals
    if (joinIntervalRef.current) {
      clearInterval(joinIntervalRef.current);
      joinIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    actions.setLobbyStatus('waiting');
    actions.setPage('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
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
              className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🏟️ Salon d'attente
            </motion.h1>
            <p className="text-gray-400 mt-1 text-sm">
              {mapData && `${mapData.emoji} ${mapData.name}`}
              {gameMode === 'private' && ` • `}
              {gameMode === 'private' && <span className="font-mono text-purple-400">#{roomCode}</span>}
            </p>
          </div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all text-sm"
          >
            ← Quitter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
          >
            {mapData && (
              <>
                <div
                  className="h-44 relative"
                  style={{ background: `linear-gradient(135deg, ${mapData.theme.skyColor}, ${mapData.theme.groundColor})` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl">{mapData.emoji}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <h2 className="text-xl font-bold text-white">{mapData.name}</h2>
                    <p className="text-gray-300 text-sm mt-0.5">{mapData.description}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-purple-400 font-bold text-lg">{mapData.structures.length}</p>
                    <p className="text-gray-400 text-xs">Structures</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-yellow-400 font-bold text-lg">{mapData.resources.reduce((a, r) => a + r.count, 0)}</p>
                    <p className="text-gray-400 text-xs">Ressources</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
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
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Code du salon</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-white flex-1 tracking-wider">{roomCode}</span>
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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm">Joueurs</p>
                <span className="text-gray-400 text-xs bg-white/5 px-2 py-0.5 rounded-full">{lobbyPlayers.length}/9</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                <AnimatePresence>
                  {lobbyPlayers.map((player: { id: string; name: string; avatar: string; isBot: boolean; isReady: boolean }, i: number) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                        {player.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{player.name}</p>
                        <p className="text-gray-500 text-[10px]">
                          {player.isBot ? '🤖 Bot' : player.id === 'local' ? '👑 Vous' : '👤 Joueur'}
                        </p>
                      </div>
                      {player.isReady && (
                        <span className="text-green-400 text-[10px]">✓</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 9 - lobbyPlayers.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-2.5 bg-white/[0.02] rounded-xl p-2 border border-dashed border-white/5">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 text-xs">
                      ?
                    </div>
                    <p className="text-gray-600 text-xs">En attente...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              {lobbyStatus === 'waiting' && (
                <>
                  <div className="text-center mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {lobbyPlayers.length < 2 ? (
                        <p className="text-gray-400 text-sm">En attente de joueurs...</p>
                      ) : (
                        <p className="text-green-400 text-sm">Assez de joueurs ! Prêt à lancer ?</p>
                      )}
                    </motion.div>
                  </div>
                  <button
                    onClick={handleStart}
                    disabled={lobbyPlayers.length < 2}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      lobbyPlayers.length >= 2
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {lobbyPlayers.length >= 2 ? '🚀 Lancer la partie' : '⏳ En attente...'}
                  </button>
                </>
              )}

              {lobbyStatus === 'countdown' && (
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">La partie commence dans</p>
                  <motion.p
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {lobbyCountdown}
                  </motion.p>
                  <p className="text-gray-500 text-xs mt-2">Préparez-vous !</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
