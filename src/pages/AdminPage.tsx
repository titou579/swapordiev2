import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, actions } from '../store/gameStore';

export default function AdminPage() {
  const user = useGameStore(s => s.user);
  const players = useGameStore(s => s.players);
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'settings' | 'monetization'>('overview');

  const tabs = [
    { id: 'overview' as const, label: '📊 Vue d\'ensemble', icon: '📊' },
    { id: 'players' as const, label: '👥 Joueurs', icon: '👥' },
    { id: 'settings' as const, label: '⚙️ Paramètres', icon: '⚙️' },
    { id: 'monetization' as const, label: '💰 Monétisation', icon: '💰' },
  ];

  const stats = {
    totalPlayers: players.length,
    activePlayers: players.filter(p => p.isAlive).length,
    totalGold: players.reduce((sum, p) => sum + p.gold, 0),
    totalGems: players.reduce((sum, p) => sum + p.gems, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500"
            >
              ⚙️ PANEL ADMIN
            </motion.h1>
            <p className="text-gray-400 mt-1">Connecté en tant que {user?.name}</p>
          </div>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
          >
            ← Retour au menu
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <p className="text-gray-400 text-sm">Joueurs Total</p>
                <p className="text-3xl font-black text-white mt-2">{stats.totalPlayers}</p>
                <p className="text-green-400 text-xs mt-1">↑ Actifs: {stats.activePlayers}</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <p className="text-gray-400 text-sm">Or en circulation</p>
                <p className="text-3xl font-black text-yellow-400 mt-2">{stats.totalGold}</p>
                <p className="text-gray-500 text-xs mt-1">Moyenne: {Math.round(stats.totalGold / Math.max(1, stats.totalPlayers))}/joueur</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <p className="text-gray-400 text-sm">Gemmes en circulation</p>
                <p className="text-3xl font-black text-blue-400 mt-2">{stats.totalGems}</p>
                <p className="text-gray-500 text-xs mt-1">Moyenne: {Math.round(stats.totalGems / Math.max(1, stats.totalPlayers))}/joueur</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <p className="text-gray-400 text-sm">Revenus (estimé)</p>
                <p className="text-3xl font-black text-green-400 mt-2">€0</p>
                <p className="text-gray-500 text-xs mt-1">Monétisation à venir</p>
              </div>

              {/* Activity Chart placeholder */}
              <div className="col-span-full bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">📈 Activité des 7 derniers jours</h3>
                <div className="flex items-end gap-2 h-40">
                  {[65, 45, 78, 52, 90, 68, 85].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg"
                      />
                      <span className="text-xs text-gray-500">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="text-white font-bold">Gestion des joueurs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="text-left p-4 text-gray-400 text-sm">Joueur</th>
                      <th className="text-left p-4 text-gray-400 text-sm">HP</th>
                      <th className="text-left p-4 text-gray-400 text-sm">Or</th>
                      <th className="text-left p-4 text-gray-400 text-sm">Gemmes</th>
                      <th className="text-left p-4 text-gray-400 text-sm">Statut</th>
                      <th className="text-left p-4 text-gray-400 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map(player => (
                      <tr key={player.id} className="border-t border-gray-700/30 hover:bg-gray-700/20">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{player.skin}</span>
                            <span className="text-white font-medium">{player.name}</span>
                            {player.id === 'local' && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Vous</span>}
                          </div>
                        </td>
                        <td className="p-4 text-white">{player.health}/{player.maxHealth}</td>
                        <td className="p-4 text-yellow-400">{player.gold}</td>
                        <td className="p-4 text-blue-400">{player.gems}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${player.isAlive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {player.isAlive ? 'En vie' : 'Éliminé'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => actions.damagePlayer(player.id, 50, 'Admin')}
                              className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                            >
                              ⚔️ DMG
                            </button>
                            <button
                              onClick={() => actions.banPlayer(player.id)}
                              className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs hover:bg-orange-500/30"
                            >
                              🚫 Ban
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">⏱️ Intervalle de Swap</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Durée (secondes)</span>
                    <input type="number" defaultValue={90} className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-center" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Mode aléatoire</span>
                    <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">🎮 Paramètres de jeu</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Joueurs max</span>
                    <input type="number" defaultValue={9} className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-center" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Ressources par map</span>
                    <input type="number" defaultValue={30} className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-center" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Dégâts pièges</span>
                    <input type="number" defaultValue={20} className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-center" />
                  </label>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">🗺️ Paramètres de la map</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Taille de la map</span>
                    <input type="number" defaultValue={60} className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-center" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-400">Zone qui rétrécit</span>
                    <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">🔧 Actions rapides</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => actions.resetGame()}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all"
                  >
                    🔄 Réinitialiser le jeu
                  </button>
                  <button
                    onClick={() => actions.triggerSwap()}
                    className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-medium transition-all"
                  >
                    ⚡ Forcer un swap
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="space-y-4">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">💰 Configuration de la monétisation</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                  <p className="text-yellow-400 text-sm">⚠️ La monétisation sera disponible prochainement. Configurez vos options ci-dessous.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Pack Starter (€4.99)</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Pack Pro (€9.99)</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Battle Pass (€14.99)</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Pub inter-partie</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Pub vidéo récompensée</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-400">Abonnement Premium</span>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">📊 Statistiques de revenus</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-green-400">€0</p>
                    <p className="text-gray-400 text-xs">Aujourd'hui</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-blue-400">€0</p>
                    <p className="text-gray-400 text-xs">Ce mois</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-purple-400">€0</p>
                    <p className="text-gray-400 text-xs">Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold mb-4">🎁 Offres spéciales</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-700/30 rounded-xl p-3">
                    <div>
                      <p className="text-white font-medium">Offre de bienvenue</p>
                      <p className="text-gray-400 text-xs">500 gemmes + skin exclusif</p>
                    </div>
                    <span className="text-green-400 font-bold">€2.99</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-700/30 rounded-xl p-3">
                    <div>
                      <p className="text-white font-medium">Pack Weekend</p>
                      <p className="text-gray-400 text-xs">2x XP + 1000 or</p>
                    </div>
                    <span className="text-green-400 font-bold">€4.99</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-700/30 rounded-xl p-3">
                    <div>
                      <p className="text-white font-medium">Mega Pack</p>
                      <p className="text-gray-400 text-xs">5000 gemmes + 3 skins légendaires</p>
                    </div>
                    <span className="text-green-400 font-bold">€19.99</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
