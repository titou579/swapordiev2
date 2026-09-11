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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🗺️ CHOISIR UNE MAP
            </motion.h1>
            <p className="text-gray-400 mt-1">
              {mode === 'private' ? `Salon privé #${roomCode}` : 'Matchmaking public'}
            </p>
          </div>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
          >
            ← Retour
          </button>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAPS.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectMap(map)}
              className="cursor-pointer bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all group"
            >
              {/* Map preview */}
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${map.theme.skyColor}, ${map.theme.groundColor})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-7xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {map.emoji}
                  </motion.span>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                {/* Difficulty badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyColors[map.difficulty]} text-white shadow-lg`}>
                    {map.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Map info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {map.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {map.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    👥 {map.players} joueurs
                  </span>
                  <span className="text-gray-500">
                    🏗️ {map.structures.length} structures
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
