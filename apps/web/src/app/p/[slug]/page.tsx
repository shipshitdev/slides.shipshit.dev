'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { slideComponents } from '@/components/slides/slide-templates';
import { type Deck, decksApi, type Project } from '@/lib/api';
import { useReveal } from '@/lib/useReveal';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

export default function PublicPresentationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [_project, _setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { deckRef } = useReveal({ ready: !loading && !!deck && !!deck.slides && deck.slides.length > 0 });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch public deck
      const deckRes = await decksApi.getPublic(slug);
      setDeck(deckRes.data);

      // Note: For public view, we'd ideally have a public project endpoint
      // For now, we'll use the embedded colors from the deck's theme or defaults
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 403) {
          setError('This presentation is private');
        } else if (error.response?.status === 404) {
          setError('Presentation not found');
        } else {
          setError('Failed to load presentation');
        }
      } else {
        setError('Failed to load presentation');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white">Loading presentation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <p className="text-gray-400">The presentation may have been deleted or made private.</p>
      </div>
    );
  }

  if (!deck) {
    return null;
  }

  if (!deck.slides || deck.slides.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No slides found</h2>
          <p className="text-gray-400">This presentation doesn't have any slides.</p>
        </div>
      </div>
    );
  }

  // Use theme colors from deck or defaults
  const colors = deck.theme?.colors || {
    primary: '#6366f1',
    background: '#ffffff',
    text: '#1a1a1a',
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        .reveal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        .reveal .slides {
          width: 100%;
          height: 100%;
          text-align: left;
        }
        .reveal .slides section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reveal .slides section > div {
          width: 100%;
          height: 100%;
          display: flex;
        }
        .reveal .controls {
          color: rgba(255, 255, 255, 0.8);
        }
        .reveal .progress {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
      <div className="h-screen w-screen overflow-hidden">
        {/* Reveal.js container */}
        <div className="reveal" ref={deckRef}>
          <div className="slides">
            {deck.slides.map((slide, index) => {
              const SlideComponent = slideComponents[slide.type] || slideComponents.content;
              return (
                <section key={slide.id || index} data-transition="slide">
                  <div className="h-full w-full">
                    <SlideComponent data={slide.data} colors={colors} />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
