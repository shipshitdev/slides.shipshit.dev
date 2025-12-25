"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { X } from "lucide-react";
import { projectsApi, decksApi, setAuthHeader, type Project, type Deck } from "@/lib/api";
import { useReveal } from "@/lib/useReveal";
import { slideComponents } from "@/components/slides/slide-templates";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";

export default function PresentPage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const projectId = params.projectId as string;
  const deckId = params.deckId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  const { deckRef } = useReveal();

  useEffect(() => {
    if (isLoaded && user) {
      setAuthHeader(user.id);
      loadData();
    }
  }, [isLoaded, user, deckId]);

  async function loadData() {
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
  }

  if (loading || !deck || !project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white">Loading presentation...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative">
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
