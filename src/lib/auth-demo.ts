/**
 * Simple authentication utility for Demo Mode.
 * This uses browser cookies to simulate a persistent session.
 */

export const SESSION_COOKIE_NAME = 'bis_session';

export type UserRole = 'resident' | 'official' | 'developer';

export interface DemoSession {
  role: UserRole;
  mobile: string;
  name: string;
}

/**
 * Set a demo session cookie.
 * @param session - The session data to store.
 */
export const setDemoSession = (session: DemoSession) => {
  if (typeof document === 'undefined') return;
  
  // Set cookie valid for 7 days
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  const cookieValue = btoa(JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE_NAME}=${cookieValue}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

/**
 * Clear the demo session cookie.
 */
export const clearDemoSession = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Get the current demo session from cookies (Client-side only)
 */
export const getClientSession = (): DemoSession | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const bisCookie = cookies.find(c => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
  
  if (!bisCookie) return null;
  
  try {
    const value = bisCookie.split('=')[1].trim();
    return JSON.parse(atob(value)) as DemoSession;
  } catch (e) {
    return null;
  }
};
