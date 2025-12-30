'use client';

import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';

interface UseRevealOptions {
  hash?: boolean;
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  controls?: boolean;
  progress?: boolean;
  center?: boolean;
  keyboard?: boolean;
  ready?: boolean; // Dependency to trigger initialization when content is ready
}

export function useReveal(options: UseRevealOptions = {}) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    // Wait for content to be ready if the ready option is provided
    if (options.ready !== undefined && !options.ready) return;
    
    if (!deckRef.current) return;

    // Destroy existing instance if re-initializing
    if (revealRef.current) {
      revealRef.current.destroy();
      revealRef.current = null;
    }

    // Check if slides container has content
    const slidesContainer = deckRef.current.querySelector('.slides');
    if (!slidesContainer || slidesContainer.children.length === 0) {
      return;
    }

    const deck = new Reveal(deckRef.current, {
      hash: options.hash ?? true,
      transition: options.transition ?? 'slide',
      controls: options.controls ?? true,
      progress: options.progress ?? true,
      center: options.center ?? false,
      keyboard: options.keyboard ?? true,
      embedded: false,
      margin: 0,
      minScale: 1,
      maxScale: 1,
      width: '100%',
      height: '100%',
    });

    deck.initialize().then(() => {
      revealRef.current = deck;
    });

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [
    options.hash,
    options.transition,
    options.controls,
    options.progress,
    options.center,
    options.keyboard,
    options.ready,
  ]);

  return { deckRef, revealRef };
}
