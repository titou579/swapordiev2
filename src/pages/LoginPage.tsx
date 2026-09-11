import { useState } from 'react';
import { motion } from 'framer-motion';
import { actions } from '../store/gameStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleOAuth = (provider: string) => {
    const names: Record<string, string> = {
      google: 'GoogleUser',
      apple: 'AppleUser',
      discord: 'DiscordGamer',
    };
    actions.login(provider, {
      name: names[provider] || 'Player',
      email: `${provider}@example.com`,
      avatar: '🎮',
    });
  };

  const handleEmailLogin = () => {
    if (email) {
      actions.login('email', {
        name: email.split('@')[0],
        email,
        avatar: '🎮',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SWAP OR DIE
          </motion.h1>
          <p className="text-gray-400 mt-2 text-sm">Échange ta position ou meurs</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h2>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-200 border border-white/10 hover:border-white/30"
            >
              <span className="text-xl">🔵</span> Continuer avec Google
            </button>
            <button
              onClick={() => handleOAuth('apple')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-200 border border-white/10 hover:border-white/30"
            >
              <span className="text-xl">🍎</span> Continuer avec Apple
            </button>
            <button
              onClick={() => handleOAuth('discord')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#5865F2]/20 hover:bg-[#5865F2]/40 rounded-xl text-white font-medium transition-all duration-200 border border-[#5865F2]/30 hover:border-[#5865F2]/60"
            >
              <span className="text-xl">💬</span> Continuer avec Discord
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">ou par email</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={handleEmailLogin}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
            >
              {isRegister ? "S'inscrire" : 'Se connecter'}
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            {isRegister ? 'Déjà un compte ?' : "Pas de compte ?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              {isRegister ? 'Se connecter' : "S'inscrire"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          En continuant, vous acceptez les conditions d'utilisation
        </p>
      </motion.div>
    </div>
  );
}
