"use client";
import Link from "next/link";
import SidebarLogin from "./sidebarLogin";
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";
import deDE from "../i18n/locales/de-DE";
import { getLocaleMessages, locales, defaultLocale, useLocale } from "../i18n";

function ProjekteButton({ isCollapsed }: { isCollapsed: boolean }) {
  const [user, setUser] = useState<any>(null);
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).sidebar ?? deDE.sidebar;
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  if (!user) return null;
  
  return (
    <li>
      <Link className="sidebar-link" href="/projekte" title={copy.projectsLinkTitle}>
        {isCollapsed ? '📁' : copy.projects}
      </Link>
    </li>
  );
}

export default function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).sidebar ?? deDE.sidebar;

  // Beim ersten Laden prüfen, ob Mobile-Gerät
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    
    // Optional: Bei Resize auch prüfen
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <nav className={`sidebar-nav ${isCollapsed ? 'collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', width: '100%' }}>
          <h2 className="sidebar-title">{!isCollapsed && copy.title}</h2>
        </div>
        <ul className="sidebar-list">
          <li><Link className="sidebar-link" href="/" title={copy.home}>
            {isCollapsed ? '🏠' : copy.home}
          </Link></li>
          <ProjekteButton isCollapsed={isCollapsed} />
          <li><Link className="sidebar-link" href="/profile" title={copy.profile}>
            {isCollapsed ? '👤' : copy.profile}
          </Link></li>
        </ul>
        {!isCollapsed && <SidebarLogin />}
      </nav>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="sidebar-toggle"
        aria-label={isCollapsed ? copy.openMenuLabel : copy.closeMenuLabel}
        title={isCollapsed ? copy.openMenuLabel : copy.closeMenuLabel}
      >
        {isCollapsed ? '☰' : '◄'}
      </button>
    </>
  );
} 