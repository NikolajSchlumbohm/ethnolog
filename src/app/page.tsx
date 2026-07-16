"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  defaultLocale,
  getLocaleFromValue,
  localeLabels,
  locales,
  localeChangeEventName,
  type LocaleCode,
} from "../i18n";

export default function Home() {
  const [locale, setLocale] = useState<LocaleCode>(defaultLocale);

  useEffect(() => {
    // Keep the selected language stable across refreshes.
    const storedLocale = window.localStorage.getItem("ethno-log-locale");
    const nextLocale = getLocaleFromValue(storedLocale);
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  useEffect(() => {
    // Sync the document language and persistence whenever the user changes the selector.
    window.localStorage.setItem("ethno-log-locale", locale);
    document.documentElement.lang = locale;
    window.dispatchEvent(new Event(localeChangeEventName));
  }, [locale]);

  const copy = useMemo(() => locales[locale].landingPage, [locale]);

  return (
    <>
      {/* Keep the selector visually close to the dark mode toggle without changing the page layout. */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 170,
          zIndex: 100,
        }}
      >
        <label
          htmlFor="landing-language"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {copy.languagePanelLabel}
        </label>
        <select
          id="landing-language"
          value={locale}
          onChange={(event) => setLocale(event.target.value as LocaleCode)}
          aria-label={copy.languagePanelLabel}
          style={{
            minHeight: 48,
            padding: "0 14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "var(--shadow)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {Object.entries(localeLabels).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            marginTop: "4rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1 className="homepage-title">{copy.title}</h1>

          <p className="homepage-subtitle">{copy.subtitle}</p>

          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
            <Link
              href="/projekte"
              style={{
                padding: "1rem 2rem",
                background: "var(--button)",
                borderRadius: 8,
                textDecoration: "none",
                color: "var(--background)",
                fontWeight: 500,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              {copy.primaryAction}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
 