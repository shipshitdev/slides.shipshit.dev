"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Presentation,
  Users,
  TrendingUp,
  Target,
  MoreVertical,
  Trash2,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  projectsApi,
  decksApi,
  setAuthHeader,
  type Project,
  type Deck,
} from "@/lib/api";

const audienceIcons = {
  cold_leads: Target,
  customers: Users,
  investors: TrendingUp,
  custom: Presentation,
};

const audienceLabels = {
  cold_leads: "Cold Leads",
  customers: "Customers",
  investors: "Investors",
  custom: "Custom",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthHeader(user.id);
      loadData();
    }
  }, [isLoaded, user, projectId]);

  async function loadData() {
    try {
      setLoading(true);
      const [projectRes, decksRes] = await Promise.all([
        projectsApi.getOne(projectId),
        decksApi.getByProject(projectId),
      ]);
      setProject(projectRes.data);
      setDecks(decksRes.data);
    } catch (err) {
      setError("Failed to load project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteDeck(deckId: string) {
    if (!confirm("Are you sure you want to delete this deck?")) return;

    try {
      await decksApi.delete(deckId);
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Are you sure you want to delete this project and all its decks?")) return;

    try {
      await projectsApi.delete(projectId);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-[var(--muted)] rounded w-32"></div>
          <div className="h-10 bg-[var(--muted)] rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-[var(--muted)] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">{error || "Project not found"}</p>
          <Link href="/dashboard">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="h-14 w-14 rounded-lg object-contain bg-[var(--muted)] p-2"
            />
          ) : (
            <div
              className="h-14 w-14 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: project.colors?.primary || "#6366f1" }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-[var(--muted-foreground)] mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/decks/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Deck
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleDeleteProject}>
            <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
          </Button>
        </div>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Presentation className="h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-lg font-medium mb-2">No decks yet</h3>
            <p className="text-[var(--muted-foreground)] text-center mb-4">
              Create your first pitch deck for different audiences
            </p>
            <Link href={`/projects/${projectId}/decks/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Deck
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const Icon = audienceIcons[deck.audienceType] || Presentation;
            return (
              <Card key={deck._id} className="hover:border-[var(--primary)] transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: project.colors?.primary || "#6366f1",
                          color: "#fff",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{deck.title}</CardTitle>
                        <CardDescription>
                          {audienceLabels[deck.audienceType]}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                    <span>{deck.slides.length} slides</span>
                    {deck.isPublic && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Eye className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/projects/${projectId}/decks/${deck._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/projects/${projectId}/decks/${deck._id}/present`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Present
                      </Button>
                    </Link>
                    {deck.isPublic && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const url = `${window.location.origin}/p/${deck.slug}`;
                          navigator.clipboard.writeText(url);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDeck(deck._id)}
                    >
                      <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
