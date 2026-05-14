export interface FriendData {
  firstName: string;
  level: number;
  xp: number;
  streak: number;
  goals: string[];
  gameMode: string;
  addedAt: string;
  code: string;
}

// Génère un code court (base64url) encodant les stats du user
export function generateShareCode(
  firstName: string,
  level: number,
  xp: number,
  streak: number,
  goals: string[],
  gameMode: string,
): string {
  const payload = { n: firstName, l: level, x: xp, s: streak, g: goals.slice(0, 3), m: gameMode };
  const json = JSON.stringify(payload);
  if (typeof btoa !== 'undefined') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
  return Buffer.from(json).toString('base64url');
}

// Décode un code partagé
export function decodeShareCode(code: string): FriendData | null {
  try {
    const padded = code.replace(/-/g, '+').replace(/_/g, '/');
    const json =
      typeof atob !== 'undefined' ? atob(padded) : Buffer.from(padded, 'base64').toString();
    const p = JSON.parse(json);
    if (!p.n || typeof p.l !== 'number') return null;
    return {
      firstName: p.n,
      level: p.l,
      xp: p.x ?? p.l * 500,
      streak: p.s ?? 0,
      goals: p.g ?? [],
      gameMode: p.m ?? 'normal',
      addedAt: new Date().toISOString(),
      code,
    };
  } catch {
    return null;
  }
}
