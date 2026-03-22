export interface AuthUser {
  username: string;
  role: 'admin' | 'teknisk' | 'user';
}

/**
 * Parse AUTH_USERS env var: "user1:pass1:role1,user2:pass2:role2"
 * Returns map of username → { password, role }
 */
function parseAuthUsers(): Map<string, { password: string; role: AuthUser['role'] }> {
  const raw = process.env.AUTH_USERS || '';
  const map = new Map<string, { password: string; role: AuthUser['role'] }>();
  if (!raw) return map;

  for (const entry of raw.split(',')) {
    const [username, password, role] = entry.split(':');
    if (username && password) {
      map.set(username, {
        password,
        role: (role as AuthUser['role']) || 'user',
      });
    }
  }
  return map;
}

export function validateCredentials(username: string, password: string): AuthUser | null {
  const users = parseAuthUsers();
  const user = users.get(username);
  if (!user || user.password !== password) return null;
  return { username, role: user.role };
}

export function getAuthUsers(): string[] {
  const users = parseAuthUsers();
  return Array.from(users.keys());
}
