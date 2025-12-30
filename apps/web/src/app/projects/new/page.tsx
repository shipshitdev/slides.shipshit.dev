'use client';

import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { brandingApi, type CreateProjectInput, projectsApi, setAuthHeader } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: '',
    websiteUrl: '',
    logo: '',
    colors: {
      primary: '#6366f1',
      secondary: '#f1f5f9',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  });

  async function handleExtractBranding() {
    if (!formData.websiteUrl) return;

    try {
      setExtracting(true);
      setError(null);
      const response = await brandingApi.extract(formData.websiteUrl);
      const branding = response.data;

      setFormData((prev) => ({
        ...prev,
        name: prev.name || branding.metadata?.title || '',
        description: prev.description || branding.metadata?.description || '',
        logo: branding.logo || prev.logo,
        colors: {
          ...prev.colors,
          ...branding.colors,
        },
        fonts: {
          ...prev.fonts,
          ...branding.fonts,
        },
      }));
    } catch (err) {
      setError('Failed to extract branding. Check the URL and try again.');
      console.error(err);
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setAuthHeader(user.id);
      
      // Clean up empty strings - convert to undefined for optional fields
      const cleanedData: CreateProjectInput = {
        ...formData,
        websiteUrl: formData.websiteUrl || undefined,
        description: formData.description || undefined,
        logo: formData.logo || undefined,
      };
      
      const response = await projectsApi.create(cleanedData);
      router.push(`/projects/${response.data._id}`);
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Set up a new project for your startup or product. You can auto-extract branding from
            your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Website URL with Extract Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL (optional)</label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExtractBranding}
                  disabled={!formData.websiteUrl || extracting}
                >
                  {extracting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Extract</span>
                </Button>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                We&apos;ll auto-extract your logo, colors, and fonts
              </p>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                required
                placeholder="My Startup"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="Brief description of your project..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Colors</label>
              <div className="grid grid-cols-5 gap-3">
                {(['primary', 'secondary', 'accent', 'background', 'text'] as const).map(
                  (color) => (
                    <div key={color} className="space-y-1">
                      <label className="text-xs text-[var(--muted-foreground)] capitalize">
                        {color}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.colors?.[color] || '#000000'}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: { ...prev.colors, [color]: e.target.value },
                            }))
                          }
                          className="h-8 w-full rounded border border-[var(--border)] cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Logo Preview */}
            {formData.logo && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="h-16 w-16 object-contain rounded bg-[var(--muted)] p-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !formData.name}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Project
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
