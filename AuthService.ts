import bcrypt from 'bcrypt';
import User from '../models/User';

class AuthService {
  private static OWNER_USERNAME = 'Reactro_Editz';
  private static OWNER_PASSWORD = 'gessey1125191514';

  async initializeOwnerAccount(): Promise<void> {
    const hashedPassword = await bcrypt.hash(AuthService.OWNER_PASSWORD, 10);
    
    const ownerUser: User = {
      id: 'owner-1',
      username: AuthService.OWNER_USERNAME,
      password: hashedPassword,
      role: 'owner',
      nitroType: 'AdvancoNitro',
      reactroCoins: 1000,
      boosts: 10,
      servers: []
    };
    
    // Save to database
    await this.saveUser(ownerUser);
  }

  async createAdminAccount(username: string, password: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser: User = {
      id: `admin-${Date.now()}`,
      username,
      password: hashedPassword,
      role: 'admin',
      nitroType: 'BasicoNitro',
      reactroCoins: 500,
      boosts: 5,
      servers: []
    };

    // Save to database
    return await this.saveUser(adminUser);
  }

  private async saveUser(user: User): Promise<User> {
    // Implementation for saving to database
    return user;
  }
}

export default AuthService;