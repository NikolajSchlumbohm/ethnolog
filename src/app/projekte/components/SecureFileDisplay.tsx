"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import deDE from "../../../i18n/locales/de-DE";
import { getLocaleMessages, useLocale } from "../../../i18n";

interface SecureFileDisplayProps {
  file: {
    name: string;
    fileName: string;
    type: string;
    size: number;
  };
  onRemove?: () => void;
}

export default function SecureFileDisplay({ file, onRemove }: SecureFileDisplayProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale } = useLocale();
  const copy = getLocaleMessages(locale).secureFileDisplay ?? deDE.secureFileDisplay;

  useEffect(() => {
    generateSignedUrl();
  }, [file.fileName]);

  const generateSignedUrl = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generiere eine Signed URL, die 1 Stunde gültig ist
      const { data, error } = await supabase.storage
        .from('documentation-files')
        .createSignedUrl(file.fileName, 3600); // 1 Stunde = 3600 Sekunden

      if (error) {
        console.error(copy.signedUrlGenerationConsoleError, error);
        setError(copy.fileGenerationError);
        return;
      }

      if (data?.signedUrl) {
        setSignedUrl(data.signedUrl);
      }
    } catch (err) {
      console.error(copy.signedUrlGenerationConsoleError, err);
      setError(copy.fileGenerationError);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!signedUrl) return;

    try {
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(copy.downloadConsoleError, err);
      alert(copy.downloadConsoleError);
    }
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: 8, 
      padding: 12, 
      marginBottom: 8,
      background: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            {file.name}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {formatFileSize(file.size)} • {file.type}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleDownload}
            disabled={!signedUrl || loading}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              opacity: (!signedUrl || loading) ? 0.6 : 1
            }}
          >
            {loading ? copy.loadingLabel : copy.downloadLabel}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                background: '#f44336',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ color: '#f44336', fontSize: 12, marginTop: 8 }}>
          {error}
        </div>
      )}

      {/* Vorschau für Bilder */}
      {isImage && signedUrl && !loading && !error && (
        <div style={{ marginTop: 12 }}>
          <img 
            src={signedUrl} 
            alt={file.name}
            style={{ 
              maxWidth: '100%', 
              maxHeight: 200, 
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          />
        </div>
      )}

      {/* Vorschau für Videos */}
      {isVideo && signedUrl && !loading && !error && (
        <div style={{ marginTop: 12 }}>
          <video 
            controls
            style={{ 
              maxWidth: '100%', 
              maxHeight: 200, 
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          >
            <source src={signedUrl} type={file.type} />
            {copy.noVideoPreviewAvailableMessage}
          </video>
        </div>
      )}

      {/* Vorschau für Audio */}
      {isAudio && signedUrl && !loading && !error && (
        <div style={{ marginTop: 12 }}>
          <audio 
            controls
            style={{ width: '100%' }}
          >
            <source src={signedUrl} type={file.type} />
            {copy.noAudioPreviewAvailableMessage}
          </audio>
        </div>
      )}
    </div>
  );
}
