import { motion } from 'framer-motion';
import { MAPS, MapData } from '../data/maps';
import { actions } from '../store/gameStore';

interface MapSelectPageProps {
  mode: 'public' | 'private';
  roomCode?: string;
}

export default function MapSelectPage({ mode, roomCode }: MapSelectPageProps) {
  const handleSelectMap = (map: MapData) => {
    actions.setSelectedMap(map.id);
    actions.startLobby(mode);
  };

  const difficultyColors = {
    facile: 'from-green-500 to-emerald-600',
    moyen: 'from-yellow-500 to-orange-600',
    difficile: 'from-red-500 to-pink-600',
  };

  const difficultyBg = {
    facile: 'bg-green-500/10 text-green-400 border-green-500/30',
    moyen: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    difficile: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🗺️ Choisir une Map
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mt-1 text-sm"
            >
              {mode === 'private' ? (
                <span>Salon privé <span className="font-mono text-purple-400">#{roomCode}</span></span>
              ) : (
                'Matchmaking public'
              )}
            </motion.p>
          </div>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all text-sm"
          >
            ← Retour
          </button>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MAPS.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectMap(map)}
              className="cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              {/* Map preview */}
              <div
                className="h-36 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${map.theme.skyColor}, ${map.theme.groundColor})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-6xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {map.emoji}
                  </motion.span>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
                {/* Difficulty badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${difficultyBg[map.difficulty]}`}>
                    {map.difficulty}
                  </span>
                </div>
                {/* Map name overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
                    {map.name}
                  </h3>
                </div>
              </div>

              {/* Map info */}
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {map.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    👥 <span className="text-gray-400">{map.players}</span>
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    🏗️ <span className="text-gray-400">{map.structures.length}</span>
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    💎 <span className="text-gray-400">{map.resources.reduce((a, r) => a + r.count, 0)}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
