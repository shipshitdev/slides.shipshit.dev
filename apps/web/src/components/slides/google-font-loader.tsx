'use client';

import { useEffect } from 'react';

interface GoogleFontLoaderProps {
  fonts?: {
    heading?: string;
    body?: string;
  };
}

export function GoogleFontLoader({ fonts }: GoogleFontLoaderProps) {
  useEffect(() => {
    const fontSet = new Set<string>();
    
    if (fonts?.heading && fonts.heading !== 'Inter') {
      fontSet.add(fonts.heading);
    }
    if (fonts?.body && fonts.body !== 'Inter') {
      fontSet.add(fonts.body);
    }

    // Load each font
    fontSet.forEach((font) => {
      const fontId = `google-font-${font.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          font
        )}:wght@400;600;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, [fonts?.heading, fonts?.body]);

  return null;
}

