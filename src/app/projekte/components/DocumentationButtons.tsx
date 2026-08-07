"use client";
import React from 'react';

import { getLocaleMessages, useLocale } from '../../../i18n';
import  deDE from '../../../i18n/locales/de-DE';



interface DocumentationButtonsProps {
  onLiveClick: () => void;
}

export default function DocumentationButtons({
  onLiveClick
}: DocumentationButtonsProps) {
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).documentationButtons ?? deDE.documentationButtons;

  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
      <button
        onClick={onLiveClick}
        style={{
          background: 'var(--button)',
          color: 'var(--text-primary)',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ fontSize: 16 }}>+</span>
        {copy.documentationLabel}
      </button>
    </div>
  );
}
