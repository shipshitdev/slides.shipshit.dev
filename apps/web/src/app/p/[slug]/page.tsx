'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  const { deckRef } = useReveal();

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function loadData() {
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
  }

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

  // Use theme colors from deck or defaults
  const colors = deck.theme?.colors || {
    primary: '#6366f1',
    background: '#ffffff',
    text: '#1a1a1a',
  };

  return (
    <div className="h-screen w-screen">
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

      <style jsx global>{`
        .reveal {
          height: 100vh;
          width: 100vw;
        }
        .reveal .slides {
          text-align: left;
        }
        .reveal .slides section {
          height: 100%;
          width: 100%;
          padding: 0;
        }
        .reveal .slides section > div {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
