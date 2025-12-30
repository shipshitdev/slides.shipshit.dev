'use client';

import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { slideComponents } from '@/components/slides/slide-templates';
import { type Deck, decksApi, type Project, projectsApi, setAuthHeader } from '@/lib/api';
import { useReveal } from '@/lib/useReveal';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

export default function PresentPage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const projectId = params.projectId as string;
  const deckId = params.deckId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  const { deckRef, revealRef } = useReveal({ ready: !loading && !!deck && !!deck.slides && deck.slides.length > 0 });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, deckRes] = await Promise.all([
        projectsApi.getOne(projectId),
        decksApi.getOne(deckId),
      ]);
      setProject(projectRes.data);
      setDeck(deckRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId, deckId]);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthHeader(user.id);
      loadData();
    }
  }, [isLoaded, user, loadData]);

  if (loading || !deck || !project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white">Loading presentation...</div>
      </div>
    );
  }

  if (!deck.slides || deck.slides.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No slides found</h2>
          <p className="text-gray-400 mb-6">This deck doesn't have any slides yet.</p>
          <Link
            href={`/projects/${projectId}/decks/${deckId}`}
            className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edit Deck
          </Link>
        </div>
      </div>
    );
  }

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
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          transform: none !important;
        }
        .reveal .slides section.present {
          transform: none !important;
        }
        .reveal .slides section > div {
          width: 100% !important;
          height: 100% !important;
          display: flex;
          padding: 0;
          margin: 0;
        }
        .reveal .controls {
          color: rgba(255, 255, 255, 0.8);
        }
        .reveal .progress {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
      <div className="h-screen w-screen relative overflow-hidden">
        {/* Close button */}
        <Link
          href={`/projects/${projectId}/decks/${deckId}`}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </Link>

        {/* Reveal.js container */}
        <div className="reveal" ref={deckRef}>
          <div className="slides">
            {deck.slides.map((slide, index) => {
              const SlideComponent = slideComponents[slide.type] || slideComponents.content;
              return (
                <section key={slide.id || index} data-transition="slide">
                  <div className="h-full w-full">
                    <SlideComponent data={slide.data} colors={project.colors} />
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
