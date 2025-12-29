import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'Pitch Deck';
  const subtitle = searchParams.get('subtitle') || '';
  const slides = searchParams.get('slides') || '0';
  const primaryColor = searchParams.get('color') || '#6366f1';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
        padding: '60px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: '100%',
          color: 'white',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '20px',
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '32px',
              opacity: 0.9,
              marginBottom: '40px',
              maxWidth: '80%',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 'auto',
            borderTop: '2px solid rgba(255, 255, 255, 0.3)',
            paddingTop: '30px',
          }}
        >
          <div style={{ fontSize: '24px', opacity: 0.8 }}>{slides} slides</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '24px',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            PitchDeck
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
