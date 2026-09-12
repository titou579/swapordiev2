import { motion } from 'framer-motion';
import { useBattlePass, battlePassActions } from '../store/battlePassStore';
import { useGameStore, actions } from '../store/gameStore';
import { useState } from 'react';

export default function BattlePassPage() {
  const battlePass = useBattlePass(s => s.battlePass);
  const user = useGameStore(s => s.user);
  const [activeTab, setActiveTab] = useState<'rewards' | 'quests'>('rewards');

  const xpProgress = (battlePass.xp / battlePass.xpToNext) * 100;

  const dailyQuests = battlePass.quests.filter(q => q.type === 'daily');
  const weeklyQuests = battlePass.quests.filter(q => q.type === 'weekly');
  const seasonQuests = battlePass.quests.filter(q => q.type === 'season');

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-600',
  };

  const rarityBorders = {
    common: 'border-gray-500/30',
    rare: 'border-blue-500/30',
    epic: 'border-purple-500/30',
    legendary: 'border-yellow-500/30',
  };

  const handlePurchasePremium = () => {
    if (user && user.gems >= 1000) {
      const success = battlePassActions.purchasePremium();
      if (success) {
        actions.updateUsername(user.username); // Refresh user data
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🎖️ Battle Pass - {battlePass.seasonName}
            </motion.h1>
            <p className="text-gray-400 mt-1 text-sm">Saison {battlePass.season}</p>
          </div>
          <button
            onClick={() => actions.setPage('menu')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all text-sm"
          >
            ← Retour
          </button>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Niveau actuel</p>
              <p className="text-3xl font-black text-white">{battlePass.level}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">XP</p>
              <p className="text-xl font-bold text-purple-400">{battlePass.xp} / {battlePass.xpToNext}</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {!battlePass.isPremium && (
            <button
              onClick={handlePurchasePremium}
              disabled={!user || user.gems < 1000}
              className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                user && user.gems >= 1000
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {battlePass.isPremium ? '✅ Pass Premium Activé' : `👑 Activer Pass Premium (1000 💎)`}
            </button>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'rewards'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            🎁 Récompenses
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'quests'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            📜 Quêtes
          </button>
        </div>

        {/* Content */}
        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Free Rewards */}
            <div>
              <h3 className="text-white font-bold mb-3">Récompenses Gratuites</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {battlePass.rewards.filter(r => !r.isPremium).map((reward, i) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white/5 rounded-xl p-3 border ${rarityBorders[reward.rarity]} ${
                      reward.claimed ? 'opacity-50' : battlePass.level >= reward.level ? 'cursor-pointer hover:bg-white/10' : 'opacity-30'
                    }`}
                    onClick={() => !reward.claimed && battlePass.level >= reward.level && battlePassActions.claimReward(reward.id)}
                  >
                    <div className="text-center">
                      <p className="text-gray-400 text-[10px] mb-1">Niv. {reward.level}</p>
                      <p className="text-3xl mb-1">{reward.image}</p>
                      <p className="text-xs text-white font-medium">{reward.name}</p>
                      {reward.claimed && <p className="text-green-400 text-[10px] mt-1">✓ Récupéré</p>}
                      {!reward.claimed && battlePass.level >= reward.level && (
                        <p className="text-purple-400 text-[10px] mt-1">Cliquer pour récupérer</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Premium Rewards */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                Récompenses Premium
                {!battlePass.isPremium && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">👑 Premium</span>}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {battlePass.rewards.filter(r => r.isPremium).map((reward, i) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white/5 rounded-xl p-3 border ${rarityBorders[reward.rarity]} ${
                      reward.claimed ? 'opacity-50' : battlePass.level >= reward.level && battlePass.isPremium ? 'cursor-pointer hover:bg-white/10' : 'opacity-30'
                    }`}
                    onClick={() => !reward.claimed && battlePass.level >= reward.level && battlePass.isPremium && battlePassActions.claimReward(reward.id)}
                  >
                    <div className="text-center">
                      <p className="text-gray-400 text-[10px] mb-1">Niv. {reward.level}</p>
                      <p className="text-3xl mb-1">{reward.image}</p>
                      <p className="text-xs text-white font-medium">{reward.name}</p>
                      {reward.claimed && <p className="text-green-400 text-[10px] mt-1">✓ Récupéré</p>}
                      {!reward.claimed && battlePass.level >= reward.level && battlePass.isPremium && (
                        <p className="text-purple-400 text-[10px] mt-1">Cliquer pour récupérer</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'quests' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Daily Quests */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                Quêtes Quotidiennes
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Se réinitialisent chaque jour</span>
              </h3>
              <div className="space-y-2">
                {dailyQuests.map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white/5 rounded-xl p-4 border ${quest.completed ? 'border-green-500/30' : 'border-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-bold">{quest.title}</p>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{quest.progress}/{quest.goal}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-purple-400 font-bold">+{quest.reward.amount}</p>
                        <p className="text-gray-500 text-xs">
                          {quest.reward.type === 'xp' ? 'XP' : quest.reward.type === 'gold' ? '💰' : quest.reward.type === 'gems' ? '💎' : '🎟️'}
                        </p>
                        {quest.completed && <p className="text-green-400 text-xs mt-1">✓ Complété</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Quests */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                Quêtes Hebdomadaires
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Se réinitialisent chaque semaine</span>
              </h3>
              <div className="space-y-2">
                {weeklyQuests.map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white/5 rounded-xl p-4 border ${quest.completed ? 'border-green-500/30' : 'border-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-bold">{quest.title}</p>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{quest.progress}/{quest.goal}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-purple-400 font-bold">+{quest.reward.amount}</p>
                        <p className="text-gray-500 text-xs">
                          {quest.reward.type === 'xp' ? 'XP' : quest.reward.type === 'gold' ? '💰' : quest.reward.type === 'gems' ? '💎' : '🎟️'}
                        </p>
                        {quest.completed && <p className="text-green-400 text-xs mt-1">✓ Complété</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Season Quests */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                Quêtes de Saison
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Objectifs à long terme</span>
              </h3>
              <div className="space-y-2">
                {seasonQuests.map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white/5 rounded-xl p-4 border ${quest.completed ? 'border-green-500/30' : 'border-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-bold">{quest.title}</p>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{quest.progress}/{quest.goal}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-purple-400 font-bold">+{quest.reward.amount}</p>
                        <p className="text-gray-500 text-xs">
                          {quest.reward.type === 'xp' ? 'XP' : quest.reward.type === 'gold' ? '💰' : quest.reward.type === 'gems' ? '💎' : '🎟️'}
                        </p>
                        {quest.completed && <p className="text-green-400 text-xs mt-1">✓ Complété</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
