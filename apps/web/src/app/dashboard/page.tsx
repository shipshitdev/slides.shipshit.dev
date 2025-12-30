'use client';

import { useUser } from '@clerk/nextjs';
import { ExternalLink, FolderOpen, Plus, Presentation } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Project, projectsApi, setAuthHeader } from '@/lib/api';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthHeader(user.id);
      loadProjects();
    }
  }, [isLoaded, user, loadProjects]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--muted)] rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-[var(--muted)] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage your pitch decks for different startups and products
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-[var(--muted-foreground)] text-center mb-4">
              Create your first project to start building pitch decks
            </p>
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <Card className="hover:border-[var(--primary)] transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt={project.name}
                          className="h-10 w-10 rounded object-contain bg-[var(--muted)]"
                        />
                      ) : (
                        <div
                          className="h-10 w-10 rounded flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: project.colors?.primary || '#6366f1' }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] flex items-center gap-1"
                          >
                            {new URL(project.websiteUrl).hostname}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <CardDescription className="line-clamp-2 mb-3">
                      {project.description}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Presentation className="h-4 w-4" />
                    <span>View Decks</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
