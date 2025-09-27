interface User {
  id: string;
  username: string;
  password: string; // Will be hashed
  role: 'owner' | 'admin' | 'user';
  nitroType: 'none' | 'BasicoNitro' | 'AdvancoNitro';
  reactroCoins: number;
  boosts: number;
  nitroExpiry?: Date;
  servers: string[]; // Array of server IDs
}

export default User;