'use client';

import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Loader2, Presentation, Target, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type CreateDeckInput, decksApi, type SlideContent, setAuthHeader } from '@/lib/api';
import { cn } from '@/lib/utils';

const audienceTypes = [
  {
    value: 'cold_leads' as const,
    label: 'Cold Leads',
    description: 'Quick intro and hook to capture attention',
    icon: Target,
  },
  {
    value: 'customers' as const,
    label: 'Potential Customers',
    description: 'Problem, solution, features, and pricing',
    icon: Users,
  },
  {
    value: 'investors' as const,
    label: 'Investors',
    description: 'Market, traction, team, and financials',
    icon: TrendingUp,
  },
  {
    value: 'custom' as const,
    label: 'Custom',
    description: 'Start with a blank deck',
    icon: Presentation,
  },
];

export default function NewDeckPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [audienceType, setAudienceType] = useState<CreateDeckInput['audienceType']>('customers');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setAuthHeader(user.id);

      const response = await decksApi.create({
        projectId,
        title,
        audienceType,
        slides: getDefaultSlides(audienceType),
        isPublic: false,
      });

      router.push(`/projects/${projectId}/decks/${response.data._id}`);
    } catch (err) {
      setError('Failed to create deck. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Deck</CardTitle>
          <CardDescription>
            Choose your target audience to get started with relevant slide templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Deck Title *</label>
              <Input
                required
                placeholder="Q1 2024 Investor Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Audience Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Target Audience</label>
              <div className="grid grid-cols-2 gap-3">
                {audienceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setAudienceType(type.value)}
                      className={cn(
                        'flex flex-col items-start gap-2 p-4 rounded-lg border text-left transition-colors',
                        audienceType === type.value
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          audienceType === type.value
                            ? 'text-[var(--primary)]'
                            : 'text-[var(--muted-foreground)]'
                        )}
                      />
                      <div>
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{type.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !title}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Deck
              </Button>
              <Link href={`/projects/${projectId}`}>
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

function getDefaultSlides(audienceType: CreateDeckInput['audienceType']): SlideContent[] {
  const baseSlides: SlideContent[] = [
    {
      id: '1',
      type: 'title',
      data: { title: 'Your Company Name', subtitle: 'Tagline goes here' },
    },
  ];

  switch (audienceType) {
    case 'cold_leads':
      return [
        ...baseSlides,
        {
          id: '2',
          type: 'content',
          data: { title: 'The Hook', bullets: ['What makes you unique?', 'Why should they care?'] },
        },
        { id: '3', type: 'cta', data: { title: "Let's Talk", buttonText: 'Schedule a Call' } },
      ];
    case 'customers':
      return [
        ...baseSlides,
        {
          id: '2',
          type: 'content',
          data: { title: 'The Problem', bullets: ['Pain point 1', 'Pain point 2'] },
        },
        {
          id: '3',
          type: 'content',
          data: { title: 'Our Solution', bullets: ['Feature 1', 'Feature 2'] },
        },
        {
          id: '4',
          type: 'stats',
          data: { title: 'Results', stats: [{ value: '10x', label: 'Faster' }] },
        },
        { id: '5', type: 'cta', data: { title: 'Get Started', buttonText: 'Try Free' } },
      ];
    case 'investors':
      return [
        ...baseSlides,
        {
          id: '2',
          type: 'content',
          data: { title: 'The Problem', bullets: ['Market gap', 'Customer pain'] },
        },
        {
          id: '3',
          type: 'content',
          data: { title: 'Our Solution', bullets: ['Product overview'] },
        },
        {
          id: '4',
          type: 'stats',
          data: { title: 'Market Size', stats: [{ value: '$10B', label: 'TAM' }] },
        },
        {
          id: '5',
          type: 'stats',
          data: { title: 'Traction', stats: [{ value: '100K', label: 'Users' }] },
        },
        { id: '6', type: 'team', data: { title: 'Team', members: [] } },
        {
          id: '7',
          type: 'content',
          data: { title: 'The Ask', bullets: ['Raising $X', 'Use of funds'] },
        },
      ];
    default:
      return baseSlides;
  }
}
