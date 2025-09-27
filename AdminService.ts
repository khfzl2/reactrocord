import User from '../models/User';
import Server from '../models/Server';

class AdminService {
  async banUser(adminId: string, userId: string): Promise<boolean> {
    const admin = await this.getUser(adminId);
    if (!this.isAuthorized(admin)) return false;

    const servers = await this.getAllServers();
    for (const server of servers) {
      if (!server.bannedUsers.includes(userId)) {
        server.bannedUsers.push(userId);
        await this.updateServer(server);
      }
    }
    return true;
  }

  async warnUser(adminId: string, userId: string): Promise<boolean> {
    const admin = await this.getUser(adminId);
    if (!this.isAuthorized(admin)) return false;

    const servers = await this.getAllServers();
    for (const server of servers) {
      const warnings = server.warnedUsers.get(userId) || 0;
      server.warnedUsers.set(userId, warnings + 1);
      await this.updateServer(server);
    }
    return true;
  }

  async timeoutUser(adminId: string, userId: string, duration: number): Promise<boolean> {
    const admin = await this.getUser(adminId);
    if (!this.isAuthorized(admin)) return false;

    const timeoutUntil = new Date(Date.now() + duration);
    const servers = await this.getAllServers();
    
    for (const server of servers) {
      server.timeoutUsers.set(userId, timeoutUntil);
      await this.updateServer(server);
    }
    return true;
  }

  private isAuthorized(user: User | null): boolean {
    return user?.role === 'owner' || user?.role === 'admin';
  }

  // Database interaction methods (to be implemented)
  private async getUser(userId: string): Promise<User | null> {
    // Implementation for fetching user from database
    return null;
  }

  private async getAllServers(): Promise<Server[]> {
    // Implementation for fetching all servers from database
    return [];
  }

  private async updateServer(server: Server): Promise<void> {
    // Implementation for updating server in database
  }
}

export default AdminService;