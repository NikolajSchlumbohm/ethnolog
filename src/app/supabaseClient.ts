import { createClient } from '@supabase/supabase-js';
import { createLocalSupabaseClient } from './localDemoBackend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const authMode = process.env.NEXT_PUBLIC_AUTH_MODE?.toLowerCase();
const isProduction = process.env.NODE_ENV === 'production';
const useLocalAuth = authMode !== 'supabase' && (authMode === 'local' || !isProduction || !supabaseUrl || !supabaseAnonKey);

type LocalUser = {
  id: string;
  email: string;
  user_metadata: Record<string, string>;
  app_metadata: Record<string, string>;
};

type AuthListener = (event: string, session: { user: LocalUser | null } | null) => void;

const LOCAL_AUTH_STORAGE_KEY = 'ethno-log-dev-auth';

function readLocalUser(): LocalUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as LocalUser;
  } catch {
    return null;
  }
}

function persistLocalUser(user: LocalUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (user) {
    window.localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
  }
}

function createLocalUser(email: string, password: string): LocalUser {
  const safeEmail = email.trim().toLowerCase();
  const identifier = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id: `local-${identifier}`,
    email: safeEmail,
    user_metadata: {
      display_name: safeEmail.split('@')[0] || 'Local User',
      bio: '',
      password_hint: password ? 'set' : '',
    },
    app_metadata: {
      auth_mode: 'local',
    },
  };
}

function createLocalAuth() {
  const listeners = new Set<AuthListener>();

  const notify = (event: string, user: LocalUser | null) => {
    const session = user ? { user } : null;
    listeners.forEach((listener) => listener(event, session));
  };

  return {
    async getUser() {
      return { data: { user: readLocalUser() }, error: null };
    },
    onAuthStateChange(listener: AuthListener) {
      listeners.add(listener);

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          listener('INITIAL_SESSION', readLocalUser() ? { user: readLocalUser() } : null);
        }, 0);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              listeners.delete(listener);
            },
          },
        },
      };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      if (!email.trim() || !password) {
        return {
          data: { user: null, session: null },
          error: new Error('E-Mail und Passwort sind erforderlich.'),
        };
      }

      const user = createLocalUser(email, password);
      persistLocalUser(user);
      notify('SIGNED_IN', user);

      return {
        data: { user, session: { user } },
        error: null,
      };
    },
    async signUp({ email, password }: { email: string; password: string }) {
      if (!email.trim() || !password) {
        return {
          data: { user: null, session: null },
          error: new Error('E-Mail und Passwort sind erforderlich.'),
        };
      }

      const user = createLocalUser(email, password);
      persistLocalUser(user);
      notify('SIGNED_UP', user);

      return {
        data: { user, session: { user } },
        error: null,
      };
    },
    async signOut() {
      persistLocalUser(null);
      notify('SIGNED_OUT', null);
      return { error: null };
    },
    async updateUser({ data }: { data: Record<string, string> }) {
      const currentUser = readLocalUser();
      if (!currentUser) {
        return {
          data: { user: null },
          error: new Error('Kein lokaler Benutzer angemeldet.'),
        };
      }

      const updatedUser: LocalUser = {
        ...currentUser,
        user_metadata: {
          ...currentUser.user_metadata,
          ...data,
        },
      };

      persistLocalUser(updatedUser);
      notify('USER_UPDATED', updatedUser);

      return {
        data: { user: updatedUser },
        error: null,
      };
    },
  };
}

// Prüfe den Auth-Modus im Client, damit lokale Entwicklung keine Remote-Logins erzwingt.
if (typeof window !== 'undefined') {
  if (!useLocalAuth && (!supabaseUrl || !supabaseAnonKey)) {
    console.error('❌ Supabase environment variables are missing!');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }

  if (useLocalAuth) {
    console.info('🟢 Local auth mode enabled for development.');
  }
}

const realSupabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const supabase = useLocalAuth
  ? (() => {
      const localClient = createLocalSupabaseClient();
      const wrapper = Object.create(realSupabase);

      Object.defineProperties(wrapper, {
        auth: {
          value: localClient.auth,
          enumerable: true,
          configurable: true,
          writable: false,
        },
        from: {
          value: localClient.from,
          enumerable: true,
          configurable: true,
          writable: false,
        },
        rpc: {
          value: localClient.rpc,
          enumerable: true,
          configurable: true,
          writable: false,
        },
        storage: {
          value: localClient.storage,
          enumerable: true,
          configurable: true,
          writable: false,
        },
      });

      return wrapper as typeof realSupabase;
    })()
  : realSupabase;

export { useLocalAuth as isLocalAuthMode };