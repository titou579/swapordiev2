import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions, ShopItem } from '../store/gameStore';

export default function ShopPage() {
  const shopItems = useGameStore(s => s.shopItems);
  const localPlayer = useGameStore(s => s.localPlayer);
  const user = useGameStore(s => s.user);
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
    common: 'border-gray-500/30 bg-gray-500/5',
    rare: 'border-blue-500/30 bg-blue-500/5',
    epic: 'border-purple-500/30 bg-purple-500/5',
    legendary: 'border-yellow-500/30 bg-yellow-500/5',
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
    const player = localPlayer || user;
    if (!player) return false;
    if (item.currency === 'gold') return (player.gold || 0) >= item.price;
    if (item.currency === 'gems') return (player.gems || 0) >= item.price;
    if (item.currency === 'tokens') return (player.tokens || 0) >= item.price;
    return false;
  };

  // Special offers
  const specialOffers = [
    {
      id: 'starter-pack',
      name: 'Pack Débutant',
      description: '500 Or + 20 Gemmes + Skin Exclusif',
      price: '4.99€',
      image: '🎁',
      originalPrice: '9.99€',
      discount: '-50%',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'pro-pack',
      name: 'Pack Pro',
      description: '2000 Or + 100 Gemmes + 5 Tokens',
      price: '9.99€',
      image: '💎',
      originalPrice: '19.99€',
      discount: '-50%',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 'legendary-pack',
      name: 'Pack Légendaire',
      description: '5000 Or + 300 Gemmes + 15 Tokens + Skin Légendaire',
      price: '19.99€',
      image: '👑',
      originalPrice: '39.99€',
      discount: '-50%',
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0033] to-[#0a0015] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            >
              🛒 Boutique
            </motion.h1>
            <p className="text-gray-400 mt-1 text-sm">Personnalise ton expérience</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Currency display */}
            <div className="hidden md:flex gap-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-yellow-400 text-sm font-medium">💰 {localPlayer?.gold || user?.gold || 0}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-blue-400 text-sm font-medium">💎 {localPlayer?.gems || user?.gems || 0}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-purple-400 text-sm font-medium">🎟️ {localPlayer?.tokens || user?.tokens || 0}</span>
              </div>
            </div>
            <button
              onClick={() => actions.setPage('menu')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all text-sm"
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Special Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            🔥 Offres Spéciales
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">Limité</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {specialOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-4 border border-white/20 cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {offer.discount}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{offer.image}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{offer.name}</h3>
                    <p className="text-white/70 text-xs">{offer.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white font-bold">{offer.price}</span>
                      <span className="text-white/50 line-through text-xs">{offer.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid with enhanced animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 100 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: item.rarity === 'legendary' 
                  ? '0 20px 40px -10px rgba(234, 179, 8, 0.4)' 
                  : item.rarity === 'epic'
                  ? '0 20px 40px -10px rgba(168, 85, 247, 0.4)'
                  : item.rarity === 'rare'
                  ? '0 20px 40px -10px rgba(59, 130, 246, 0.4)'
                  : '0 10px 20px -5px rgba(0, 0, 0, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer rounded-2xl p-3 border-2 transition-all relative overflow-hidden group ${rarityColors[item.rarity]}`}
            >
              {/* Rarity glow effect */}
              {item.rarity === 'legendary' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              {item.rarity === 'epic' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              <div className="text-center relative z-10">
                <motion.div
                  className="text-4xl mb-2"
                  whileHover={{ scale: 1.3, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  animate={item.rarity === 'legendary' ? {
                    y: [0, -3, 0],
                  } : {}}
                >
                  {item.image}
                </motion.div>
                <h3 className="text-white font-bold text-xs truncate">{item.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <motion.span 
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                      item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {rarityLabels[item.rarity]}
                  </motion.span>
                  <motion.span 
                    className="text-white font-bold text-xs"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {currencyIcons[item.currency]}{item.price}
                  </motion.span>
                </div>
                {item.owned && (
                  <motion.div 
                    className="mt-1.5 text-green-400 text-[10px] font-bold"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ✓ Possédé
                  </motion.div>
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
