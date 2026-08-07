"use client";
import React from 'react';
import { useLocale, getLocaleMessages } from '../../../i18n';
import deDE from '../../../i18n/locales/de-DE';

// Dark Mode CSS Variables
const isDarkMode = typeof window !== 'undefined' && 
  document.documentElement.classList.contains('dark');

interface TabNavigationProps {
  optionTabs: string[];
  activeOptionTab: string | null;
  showCalendar: boolean;
  selectedDate: string;
  onTabChange: (tab: string) => void;
  onCalendarToggle: () => void;
  onDeleteOption: (opt: string) => void;
}

export default function TabNavigation({
  optionTabs,
  activeOptionTab,
  showCalendar,
  selectedDate,
  onTabChange,
  onCalendarToggle,
  onDeleteOption
}: TabNavigationProps) {
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).tabNavigation ?? deDE.tabNavigation;
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {optionTabs.map((opt: string) => {
        const isActive = activeOptionTab === opt;
        return (
          <div key={opt} style={{ position: 'relative' }}>
            <button
              onClick={() => onTabChange(opt)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: isActive ? '2px solid #ff9800' : (isDarkMode ? '1.5px solid #4a5568' : '1.5px solid #bbb'),
                background: isActive ? '#ff9800' : (isDarkMode ? '#2d3748' : '#f5f5f5'),
                color: isActive ? '#fff' : (isDarkMode ? '#e2e8f0' : '#232b5d'),
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px #ff980033' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {opt}
            </button>
            {/* Löschen-Button für Option-Tabs außer Start */}
            {isActive && opt !== 'Start' && (
              <button
                onClick={() => onDeleteOption(opt)}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: -32,
                  background: isDarkMode ? '#2d3748' : '#fff',
                  color: '#b00',
                  border: '1.5px solid #b00',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginLeft: 8
                }}
                title={copy.deleteOptionLabel}
              >
                🗑
              </button>
            )}
          </div>
        );
      })}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onCalendarToggle}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: showCalendar ? '2px solid #3a4a8c' : (isDarkMode ? '1.5px solid #4a5568' : '1.5px solid #bbb'),
            background: showCalendar ? '#3a4a8c' : (isDarkMode ? '#2d3748' : '#f5f5f5'),
            color: showCalendar ? '#fff' : (isDarkMode ? '#e2e8f0' : '#232b5d'),
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          title={copy.showCalenderLabel}
        >
          <span style={{ fontSize: 16 }}>📅</span>
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('de-DE') : copy.todayLabel}
          </span>
          <span style={{ fontSize: 11, opacity: 0.6 }}>
            {showCalendar ? '▼' : '▶'}
          </span>
        </button>
      </div>
    </div>
  );
}
