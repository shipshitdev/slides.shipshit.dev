'use client';

import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Eye, EyeOff, Loader2, Play, Save, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { slideComponents } from '@/components/slides/slide-templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type Deck,
  decksApi,
  type Project,
  projectsApi,
  type SlideContent,
  setAuthHeader,
} from '@/lib/api';
import { cn } from '@/lib/utils';

const slideTypes = [
  { value: 'title', label: 'Title' },
  { value: 'content', label: 'Content' },
  { value: 'stats', label: 'Stats' },
  { value: 'team', label: 'Team' },
  { value: 'quote', label: 'Quote' },
  { value: 'cta', label: 'CTA' },
  { value: 'image', label: 'Image' },
];

export default function DeckEditorPage() {
  const params = useParams();
  const _router = useRouter();
  const { user, isLoaded } = useUser();
  const projectId = params.projectId as string;
  const deckId = params.deckId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthHeader(user.id);
      loadData();
    }
  }, [isLoaded, user, loadData]);

  async function loadData() {
    try {
      setLoading(true);
      const [projectRes, deckRes] = await Promise.all([
        projectsApi.getOne(projectId),
        decksApi.getOne(deckId),
      ]);
      setProject(projectRes.data);
      setDeck(deckRes.data);
      setSlides(deckRes.data.slides || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!deck) return;

    try {
      setSaving(true);
      await decksApi.update(deckId, { slides });
      setHasChanges(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublic() {
    if (!deck) return;

    try {
      await decksApi.update(deckId, { isPublic: !deck.isPublic });
      setDeck((prev) => (prev ? { ...prev, isPublic: !prev.isPublic } : null));
    } catch (err) {
      console.error(err);
    }
  }

  function addSlide(type: string) {
    const newSlide: SlideContent = {
      id: Date.now().toString(),
      type,
      data: getDefaultData(type),
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setSelectedSlideIndex(newSlides.length - 1);
    setHasChanges(true);
  }

  function deleteSlide(index: number) {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setSelectedSlideIndex(Math.min(index, newSlides.length - 1));
    setHasChanges(true);
  }

  function updateSlideData(index: number, data: Record<string, unknown>) {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], data };
    setSlides(newSlides);
    setHasChanges(true);
  }

  function _moveSlide(fromIndex: number, toIndex: number) {
    const newSlides = [...slides];
    const [removed] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, removed);
    setSlides(newSlides);
    setSelectedSlideIndex(toIndex);
    setHasChanges(true);
  }

  const selectedSlide = slides[selectedSlideIndex];
  const SlideComponent = selectedSlide
    ? slideComponents[selectedSlide.type] || slideComponents.content
    : null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!deck || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Deck not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">{deck.title}</h1>
            <p className="text-xs text-[var(--muted-foreground)]">{project.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={togglePublic}>
            {deck.isPublic ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Public
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Private
              </>
            )}
          </Button>
          {deck.isPublic && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const url = `${window.location.origin}/p/${deck.slug}`;
                navigator.clipboard.writeText(url);
              }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Copy Link
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
          <Link href={`/projects/${projectId}/decks/${deckId}/present`}>
            <Button size="sm">
              <Play className="h-4 w-4 mr-1" />
              Present
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Slide List */}
        <aside className="w-64 border-r border-[var(--border)] overflow-y-auto p-4">
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                onClick={() => setSelectedSlideIndex(index)}
                className={cn(
                  'relative aspect-video rounded-lg border cursor-pointer overflow-hidden group',
                  index === selectedSlideIndex
                    ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                )}
              >
                <div className="absolute inset-0 scale-[0.2] origin-top-left w-[500%] h-[500%]">
                  {SlideComponent && (
                    <div className="w-full h-full">
                      {(() => {
                        const Comp = slideComponents[slide.type] || slideComponents.content;
                        return <Comp data={slide.data} colors={project.colors} />;
                      })()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">
                  {index + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Slide */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Add Slide</p>
            <div className="grid grid-cols-2 gap-2">
              {slideTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addSlide(type.value)}
                  className="text-xs p-2 border border-[var(--border)] rounded hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Preview & Editor */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--muted)]">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8">
            {selectedSlide && SlideComponent && (
              <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                <SlideComponent data={selectedSlide.data} colors={project.colors} />
              </div>
            )}
          </div>

          {/* Editor */}
          {selectedSlide && (
            <div className="h-64 border-t border-[var(--border)] bg-[var(--background)] overflow-y-auto p-4">
              <SlideEditor
                slide={selectedSlide}
                onChange={(data) => updateSlideData(selectedSlideIndex, data)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SlideEditor({
  slide,
  onChange,
}: {
  slide: SlideContent;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const data = slide.data;

  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Title field - most slides have this */}
      {['title', 'content', 'stats', 'team', 'cta', 'image'].includes(slide.type) && (
        <div className="space-y-1">
          <label className="text-xs font-medium">Title</label>
          <Input
            value={String(data.title || '')}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Slide title..."
          />
        </div>
      )}

      {/* Subtitle for title slides */}
      {slide.type === 'title' && (
        <div className="space-y-1">
          <label className="text-xs font-medium">Subtitle</label>
          <Input
            value={String(data.subtitle || '')}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Tagline or subtitle..."
          />
        </div>
      )}

      {/* Bullets for content slides */}
      {slide.type === 'content' && (
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-medium">Bullet Points (one per line)</label>
          <textarea
            className="w-full h-24 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            value={((data.bullets as string[]) || []).join('\n')}
            onChange={(e) => updateField('bullets', e.target.value.split('\n').filter(Boolean))}
            placeholder="Enter bullet points..."
          />
        </div>
      )}

      {/* Stats */}
      {slide.type === 'stats' && (
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-medium">Stats (value|label, one per line)</label>
          <textarea
            className="w-full h-24 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            value={((data.stats as Array<{ value: string; label: string }>) || [])
              .map((s) => `${s.value}|${s.label}`)
              .join('\n')}
            onChange={(e) =>
              updateField(
                'stats',
                e.target.value
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => {
                    const [value, label] = line.split('|');
                    return { value: value?.trim() || '', label: label?.trim() || '' };
                  })
              )
            }
            placeholder="10x|Faster&#10;$1M|Revenue"
          />
        </div>
      )}

      {/* Quote */}
      {slide.type === 'quote' && (
        <>
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium">Quote</label>
            <textarea
              className="w-full h-16 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
              value={String(data.quote || '')}
              onChange={(e) => updateField('quote', e.target.value)}
              placeholder="The quote text..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Author</label>
            <Input
              value={String(data.author || '')}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder="Author name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Role</label>
            <Input
              value={String(data.role || '')}
              onChange={(e) => updateField('role', e.target.value)}
              placeholder="CEO, Company"
            />
          </div>
        </>
      )}

      {/* CTA */}
      {slide.type === 'cta' && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium">Button Text</label>
            <Input
              value={String(data.buttonText || '')}
              onChange={(e) => updateField('buttonText', e.target.value)}
              placeholder="Get Started"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Description</label>
            <Input
              value={String(data.description || '')}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Optional description..."
            />
          </div>
        </>
      )}

      {/* Image */}
      {slide.type === 'image' && (
        <>
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium">Image URL</label>
            <Input
              value={String(data.imageUrl || '')}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Caption</label>
            <Input
              value={String(data.caption || '')}
              onChange={(e) => updateField('caption', e.target.value)}
              placeholder="Image caption..."
            />
          </div>
        </>
      )}
    </div>
  );
}

function getDefaultData(type: string): Record<string, unknown> {
  switch (type) {
    case 'title':
      return { title: 'New Slide', subtitle: '' };
    case 'content':
      return { title: 'Content', bullets: ['Point 1', 'Point 2'] };
    case 'stats':
      return { title: 'Stats', stats: [{ value: '100', label: 'Metric' }] };
    case 'team':
      return { title: 'Team', members: [] };
    case 'quote':
      return { quote: 'Quote text', author: 'Author' };
    case 'cta':
      return { title: 'Get Started', buttonText: 'Contact Us' };
    case 'image':
      return { title: '', imageUrl: '', caption: '' };
    default:
      return {};
  }
}
