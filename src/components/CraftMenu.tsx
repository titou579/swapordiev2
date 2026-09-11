import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, actions, CraftRecipe } from '../store/gameStore';

interface CraftMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CraftMenu({ isOpen, onClose }: CraftMenuProps) {
  const localPlayer = useGameStore(s => s.localPlayer);
  const craftRecipes = useGameStore(s => s.craftRecipes);

  if (!localPlayer) return null;

  const canCraft = (recipe: CraftRecipe): boolean => {
    for (const ingredient of recipe.ingredients) {
      if (localPlayer.resources[ingredient.type] < ingredient.amount) {
        return false;
      }
    }
    return true;
  };

  const handleCraft = (recipeId: string) => {
    const success = actions.craftItem(recipeId);
    if (success) {
      // Show success feedback
      setTimeout(() => {
        // Could add a toast notification here
      }, 100);
    }
  };

  const getResourceIcon = (type: string): string => {
    switch (type) {
      case 'wood': return '🪵';
      case 'stone': return '🪨';
      case 'gold': return '💰';
      case 'gem': return '💎';
      default: return '📦';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gray-900 rounded-3xl p-6 border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">🔨 Craft</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Resources */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <h3 className="text-white font-bold mb-3">Vos Ressources</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">🪵</p>
                  <p className="text-white font-bold">{localPlayer.resources.wood}</p>
                  <p className="text-gray-400 text-xs">Bois</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">🪨</p>
                  <p className="text-white font-bold">{localPlayer.resources.stone}</p>
                  <p className="text-gray-400 text-xs">Pierre</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">💰</p>
                  <p className="text-white font-bold">{localPlayer.resources.gold}</p>
                  <p className="text-gray-400 text-xs">Or</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">💎</p>
                  <p className="text-white font-bold">{localPlayer.resources.gem}</p>
                  <p className="text-gray-400 text-xs">Gemme</p>
                </div>
              </div>
            </div>

            {/* Recipes */}
            <div className="space-y-3">
              <h3 className="text-white font-bold mb-3">Recettes Disponibles</h3>
              {craftRecipes.map((recipe) => {
                const craftable = canCraft(recipe);
                return (
                  <motion.div
                    key={recipe.id}
                    whileHover={{ scale: craftable ? 1.02 : 1 }}
                    className={`bg-gray-800/50 rounded-xl p-4 border ${
                      craftable ? 'border-green-500/30 hover:border-green-500/50' : 'border-gray-700/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{recipe.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{recipe.name}</h4>
                        <p className="text-gray-400 text-sm">{recipe.description}</p>
                        <div className="flex gap-2 mt-2">
                          {recipe.ingredients.map((ing, i) => {
                            const hasEnough = localPlayer.resources[ing.type] >= ing.amount;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                  hasEnough ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                <span>{getResourceIcon(ing.type)}</span>
                                <span>{localPlayer.resources[ing.type]}/{ing.amount}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCraft(recipe.id)}
                        disabled={!craftable}
                        className={`px-4 py-2 rounded-xl font-bold transition-all ${
                          craftable
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Craft
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
