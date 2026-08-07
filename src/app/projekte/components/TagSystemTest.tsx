"use client";
import React, {useEffect, useState } from 'react';
import TagInput from './TagInput';
import deDE from "../../../i18n/locales/de-DE";
import {
  defaultLocale,
  getLocaleFromValue,
  localeLabels,
  locales,
  localeChangeEventName,
  type LocaleCode,
  getLocaleMessages,
  useLocale
} from "../../../i18n";


export default function TagSystemTest() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locale, setLocale] = useState<LocaleCode>(defaultLocale);
   
  const copy = getLocaleMessages(locale).tagSystemTest ?? deDE.tagSystemTest;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>{copy.title}</h2>
      <p>{copy.tagInfoLabel}</p>
      
      <div style={{ marginBottom: 20 }}>
        <h3>{copy.availableTagsLabel}</h3>
        <p>{copy.standardTagsInfoLabel}</p>
        <ul>
          <li><strong>{copy.formalTagTypeLabel}</strong>{copy.formalInfoLabel}</li>
          <li><strong>{copy.informalTagTypeLabel}</strong>{copy.informalInfoLabel}</li>
          <li><strong>{copy.externalTagTypeLabel}</strong>{copy.externalInfoLabel}</li>
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>{copy.enterTagLabel}</h3>
        <TagInput
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          placeholder={copy.clickToSearchOrCreateTagLabel}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>{copy.selectedTagsLabel}</h3>
        {selectedTags.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{copy.noTagsSelectedLabel}</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedTags.map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: '4px 8px',
                  background: 'var(--primary-blue)',
                  color: 'white',
                  borderRadius: 12,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        padding: 16, 
        background: 'var(--surface-hover)', 
        borderRadius: 8, 
        border: '1px solid var(--border)' 
      }}>
        <h3>{copy.instructionsHeader}</h3>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>{copy.availableTagsInstruction}</li>
          <li>{copy.chooseOrCreateTagInstruction}</li>
          <li>{copy.addTagInstruction}</li>
          <li>{copy.removeTagInstruction}</li>
        </ol>
      </div>
    </div>
  );
}
