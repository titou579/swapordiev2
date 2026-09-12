// Simple localStorage-based user management system
export interface UserAccount {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar: string;
  provider: 'email' | 'google' | 'apple' | 'discord';
  createdAt: number;
  gold: number;
  gems: number;
  tokens: number;
  stats: {
    gamesPlayed: number;
    wins: number;
    kills: number;
    deaths: number;
    swaps: number;
  };
}

const USERS_KEY = 'swapordie_users';
const CURRENT_USER_KEY = 'swapordie_current_user';

export const userStorage = {
  // Get all users
  getUsers(): UserAccount[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save all users
  saveUsers(users: UserAccount[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Create new user
  createUser(email: string, password: string, username: string, provider: 'email' | 'google' | 'apple' | 'discord' = 'email'): UserAccount {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Cet email est déjà utilisé');
    }

    const newUser: UserAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password,
      username,
      avatar: '🎮',
      provider,
      createdAt: Date.now(),
      gold: 200,
      gems: 10,
      tokens: 5,
      stats: {
        gamesPlayed: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        swaps: 0,
      },
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },

  // Login user
  login(email: string, password: string): UserAccount | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Login with OAuth (simulated)
  loginWithOAuth(provider: 'google' | 'apple' | 'discord', email: string, username: string): UserAccount {
    const users = this.getUsers();
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user
      user = this.createUser(email, '', username, provider);
    } else {
      // Update provider if different
      if (user.provider !== provider) {
        user.provider = provider;
        this.saveUsers(users);
      }
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // Get current logged in user
  getCurrentUser(): UserAccount | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Update current user
  updateCurrentUser(updates: Partial<UserAccount>) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in users list
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }

    // Update current user session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  },

  // Logout
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Update username
  updateUsername(newUsername: string) {
    this.updateCurrentUser({ username: newUsername });
  },

  // Update avatar
  updateAvatar(newAvatar: string) {
    this.updateCurrentUser({ avatar: newAvatar });
  },

  // Update stats
  updateStats(stats: Partial<UserAccount['stats']>) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;
    
    this.updateCurrentUser({
      stats: { ...currentUser.stats, ...stats }
    });
  },

  // Update currency
  updateCurrency(gold?: number, gems?: number, tokens?: number) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;
    
    this.updateCurrentUser({
      gold: gold !== undefined ? gold : currentUser.gold,
      gems: gems !== undefined ? gems : currentUser.gems,
      tokens: tokens !== undefined ? tokens : currentUser.tokens,
    });
  },

  // Check if username is available
  isUsernameAvailable(username: string): boolean {
    const users = this.getUsers();
    return !users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },
};
