/**
 * localStorage-backed token + user cache.
 *
 * We intentionally do NOT use httpOnly cookies here — the frontend is a
 * static export hosted on GitHub Pages, so setting cookies from a
 * different-origin API is blocked by the browser anyway. The trade-off
 * is that tokens sit in localStorage and are reachable by any XSS on
 * this origin — the only mitigation is keeping strict about what we
 * render as dangerouslySetInnerHTML and what we take from the URL.
 *
 * Access tokens are short-lived (15m) so the blast radius of a leaked
 * access token is bounded. Refresh tokens rotate on every use server-side.
 */

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
}

export interface StoredAuth {
  user: StoredUser;
  accessToken: string;
  refreshToken: string;
}

const KEY = "techshop_auth_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const storage = {
  get(): StoredAuth | null {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
      return null;
    }
  },
  set(auth: StoredAuth): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(auth));
      // Notify other tabs of the login/logout.
      window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    } catch {
      /* quota / security — ignore */
    }
  },
  clear(): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    } catch {
      /* ignore */
    }
  },
  patchUser(patch: Partial<StoredUser>): void {
    if (!isBrowser()) return;
    const current = this.get();
    if (!current) return;
    this.set({ ...current, user: { ...current.user, ...patch } });
  },
};
