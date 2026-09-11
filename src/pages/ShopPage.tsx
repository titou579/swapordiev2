import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions, ShopItem } from '../store/gameStore';

export default function ShopPage() {
  const shopItems = useGameStore(s => s.shopItems);
  const localPlayer = useGameStore(s => s.localPlayer);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const categories = [
    { id: 'all', label: '🏪 Tout', color: 'from-gray-600 to-gray-700' },
    { id: 'skin', label: '🎨 Skins', color: 'from-purple-600 to-pink-600' },
    { id: 'trap', label: '⚙️ Pièges', color: 'from-red-600 to-orange-600' },
    { id: 'weapon', label: '⚔️ Armes', color: 'from-blue-600 to-cyan-600' },
    { id: 'background', label: '🖼️ Fonds', color: 'from-green-600 to-emerald-600' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory);

  const rarityColors: Record<string, string> = {
    common: 'border-gray-500 bg-gray-500/10',
    rare: 'border-blue-500 bg-blue-500/10',
    epic: 'border-purple-500 bg-purple-500/10',
    legendary: 'border-yellow-500 bg-yellow-500/10',
  };

  const rarityLabels: Record<string, string> = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire',
  };

  const currencyIcons: Record<string, string> = {
    gold: '💰',
    gems: '💎',
    tokens: '🎟️',
  };

  const handleBuy = (item: ShopItem) => {
    actions.buyItem(item.id);
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedItem(null);
    }, 1500);
  };

  const canAfford = (item: ShopItem): boolean => {
    if (!localPlayer) return false;
    if (item.currency === 'gold') return localPlayer.gold >= item.price;
    if (item.currency === 'gems') return localPlayer.gems >= item.price;
    if (item.currency === 'tokens') return localPlayer.tokens >= item.price;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
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
              🛒 BOUTIQUE
            </motion.h1>
            <p className="text-gray-400 mt-1">Personnalise ton expérience</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Currency display */}
            <div className="flex gap-3">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/50">
                <span className="text-yellow-400">💰 {localPlayer?.gold || 0}</span>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/50">
                <span className="text-blue-400">💎 {localPlayer?.gems || 0}</span>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/50">
                <span className="text-purple-400">🎟️ {localPlayer?.tokens || 0}</span>
              </div>
            </div>
            <button
              onClick={() => actions.setPage('menu')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-gray-300 font-medium transition-all"
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${rarityColors[item.rarity]} hover:shadow-lg`}
            >
              <div className="text-center">
                <motion.div
                  className="text-5xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {item.image}
                </motion.div>
                <h3 className="text-white font-bold text-sm">{item.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                    item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                    item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {rarityLabels[item.rarity]}
                  </span>
                  <span className="text-white font-bold text-sm">
                    {currencyIcons[item.currency]} {item.price}
                  </span>
                </div>
                {item.owned && (
                  <div className="mt-2 text-green-400 text-xs font-bold">✓ Possédé</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gray-900 rounded-3xl p-8 border border-gray-700 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedItem.image}
                  </motion.div>
                  <h2 className="text-2xl font-black text-white">{selectedItem.name}</h2>
                  <p className="text-gray-400 mt-2">{selectedItem.description}</p>
                  <div className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                    selectedItem.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    selectedItem.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    selectedItem.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {rarityLabels[selectedItem.rarity]}
                  </div>

                  <div className="mt-6">
                    {selectedItem.owned ? (
                      <div className="text-green-400 font-bold text-lg">✓ Déjà possédé</div>
                    ) : (
                      <>
                        <p className="text-white text-xl font-bold mb-4">
                          {currencyIcons[selectedItem.currency]} {selectedItem.price}
                        </p>
                        {purchaseSuccess ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-400 font-bold text-lg"
                          >
                            ✅ Acheté avec succès !
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => handleBuy(selectedItem)}
                            disabled={!canAfford(selectedItem)}
                            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                              canAfford(selectedItem)
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {canAfford(selectedItem) ? '🛒 Acheter' : '💸 Fonds insuffisants'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
