export type ServerHealthStatus = 'loading' | 'online' | 'offline';

export const checkServerHealth = async (ip: string, port: string): Promise<ServerHealthStatus> => {
  try {
    const response = await fetch(`http://${ip}:${port}/bots/get-all`);
    return response.ok ? 'online' : 'offline';
  } catch {
    return 'offline';
  }
};
