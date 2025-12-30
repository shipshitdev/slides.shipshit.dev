'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Popular Google Fonts curated list
export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Ubuntu',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Oswald',
  'Lora',
  'Nunito',
  'PT Sans',
  'Roboto Condensed',
  'Cabin',
  'Noto Sans',
  'Dancing Script',
  'Crimson Text',
  'Fira Sans',
  'Work Sans',
  'Libre Baskerville',
  'Barlow',
  'Inconsolata',
  'Space Mono',
  'Rubik',
  'Quicksand',
  'Kanit',
  'Titillium Web',
].sort();

interface FontSelectProps {
  value: string;
  onChange: (font: string) => void;
  label?: string;
  className?: string;
}

export function FontSelect({ value, onChange, label, className }: FontSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredFonts = GOOGLE_FONTS.filter((font) =>
    font.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFont = value || 'Inter';

  // Load font preview
  useEffect(() => {
    if (selectedFont) {
      const fontId = `font-${selectedFont.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          selectedFont
        )}:wght@400;600;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [selectedFont]);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {label && <label className="text-xs font-medium mb-1 block">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] hover:border-[var(--primary)] transition-colors"
        style={{ fontFamily: selectedFont }}
      >
        <span>{selectedFont}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md shadow-lg max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              type="text"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-56">
            {filteredFonts.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
                No fonts found
              </div>
            ) : (
              filteredFonts.map((font) => {
                // Load font for preview
                const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
                  font
                )}:wght@400&display=swap`;
                const linkId = `font-preview-${font.replace(/\s+/g, '-')}`;
                if (!document.getElementById(linkId)) {
                  const link = document.createElement('link');
                  link.id = linkId;
                  link.href = fontUrl;
                  link.rel = 'stylesheet';
                  document.head.appendChild(link);
                }

                return (
                  <button
                    key={font}
                    type="button"
                    onClick={() => {
                      onChange(font);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent)] transition-colors',
                      selectedFont === font && 'bg-[var(--primary)]/10 font-medium'
                    )}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

