"use client";
import React from 'react';
import { getLocaleMessages, useLocale } from '../../../i18n';
import  deDE from '../../../i18n/locales/de-DE';

interface DeleteOptionDialogProps {
  open: boolean;
  loading: boolean;
  onRemoveOnly: () => void;
  onClose: () => void;
}

export default function DeleteOptionDialog({ open, loading, onRemoveOnly, onClose }: DeleteOptionDialogProps) {
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).deleteOptionDialog ?? deDE.deleteOptionDialog;
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: '2rem 2.5rem', minWidth: 320, boxShadow: '0 2px 16px #0003', color: '#232b5d' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>{copy.deleteOptionTitle}</div>
        <div style={{ marginBottom: 18 }}>
          {copy.deleteOptionMessage}
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <button onClick={onRemoveOnly} disabled={loading} style={{ background: '#b00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Option löschen</button>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: '#232b5d', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>Abbrechen</button>
      </div>
    </div>
  );
}


