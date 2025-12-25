"use client";

import { useEffect, useRef } from "react";
import Reveal from "reveal.js";

interface UseRevealOptions {
  hash?: boolean;
  transition?: "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
  controls?: boolean;
  progress?: boolean;
  center?: boolean;
  keyboard?: boolean;
}

export function useReveal(options: UseRevealOptions = {}) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    if (!deckRef.current || revealRef.current) return;

    const deck = new Reveal(deckRef.current, {
      hash: options.hash ?? true,
      transition: options.transition ?? "slide",
      controls: options.controls ?? true,
      progress: options.progress ?? true,
      center: options.center ?? true,
      keyboard: options.keyboard ?? true,
      width: 1920,
      height: 1080,
      margin: 0,
      minScale: 0.2,
      maxScale: 2.0,
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
  }, [options.hash, options.transition, options.controls, options.progress, options.center, options.keyboard]);

  return { deckRef, revealRef };
}
