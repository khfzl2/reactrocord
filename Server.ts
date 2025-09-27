interface Server {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // Array of user IDs
  boosts: number;
  bannedUsers: string[]; // Array of banned user IDs
  warnedUsers: Map<string, number>; // User ID to warning count
  timeoutUsers: Map<string, Date>; // User ID to timeout expiry
}

export default Server;