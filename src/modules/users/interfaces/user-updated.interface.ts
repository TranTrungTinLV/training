export interface IUpdatedUser {
  refreshToken: string | null;
  status: 'online' | 'offline';
  loggedAt: Date;
}
