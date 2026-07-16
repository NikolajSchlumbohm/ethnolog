"use client";
import { useState, useEffect } from "react";
import { isLocalAuthMode, supabase } from "./supabaseClient";
import deDE from "../i18n/locales/de-DE";
import { getLocaleMessages, useLocale } from "../i18n";


export default function SidebarLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).sidebarLogin ?? deDE.sidebarLogin;

  useEffect(() => {
    // Defer auth-driven UI until after hydration so localStorage-backed sessions do not cause mismatches.
    setMounted(true);

    // Initialen User-Status abfragen
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listener für Auth-Status-Änderungen
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  if (!mounted) {
    return (
      <form
        className="sidebar-login"
        style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32, width: '100%' }}
      >
        <input type="email" placeholder={copy.emailPlaceholder} required defaultValue="" readOnly />
        <input type="password" placeholder={copy.passwordPlaceholder} required defaultValue="" readOnly />
        <button type="button" disabled>
          {copy.login}
        </button>
        <button type="button" disabled>
          {copy.register}
        </button>
      </form>
    );
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSuccess(copy.loginSuccess);
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess(isLocalAuthMode ? copy.localRegisterSuccess : copy.registerSuccess);
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setError("");
    setSuccess("");
    await supabase.auth.signOut();
    setLoading(false);
  }

  if (user) {
    return (
      <div style={{ marginTop: 32, width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{copy.loggedInAsLabel}</div>
        <div style={{ wordBreak: 'break-all', marginBottom: 8 }}>{user.email}</div>
        <button
          onClick={handleLogout}
          className="logout-button"
          disabled={loading}
        >
          {loading ? copy.logoutLoading : copy.logout}
        </button>
      </div>
    );
  }

  return (
    <form
      className="sidebar-login"
      style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32, width: '100%' }}
      onSubmit={handleLogin}
    >
      {isLocalAuthMode && (
        <div className="login-success" style={{ marginBottom: 4 }}>
          {copy.localTestMode}
        </div>
      )}
      <input
        type="email"
        placeholder={copy.emailPlaceholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={copy.passwordPlaceholder}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
      >
        {loading ? copy.loginLoading : copy.login}
      </button>
      <button
        type="button"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? copy.registerLoading : copy.register}
      </button>
      {error && <div className="login-error">{error}</div>}
      {success && <div className="login-success">{success}</div>}
    </form>
  );
} 