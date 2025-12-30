'use client';

import { GripVertical, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { SlideContent } from '@/types';
import { slideComponents } from './slide-templates';

interface SortableSlideItemProps {
  slide: SlideContent;
  index: number;
  isSelected: boolean;
  projectColors: {
    primary?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  onSelect: () => void;
  onDelete: () => void;
}

function SortableSlideItem({
  slide,
  index,
  isSelected,
  projectColors,
  fonts,
  onSelect,
  onDelete,
}: SortableSlideItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const SlideComponent = slideComponents[slide.type] || slideComponents.content;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        'relative aspect-video rounded-lg border cursor-pointer overflow-hidden group',
        isSelected
          ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
          : 'border-[var(--border)] hover:border-[var(--primary)]/50',
        isDragging && 'opacity-50'
      )}
    >
      <div className="absolute inset-0 scale-[0.2] origin-top-left w-[500%] h-[500%]">
        <div className="w-full h-full">
          <SlideComponent data={slide.data} colors={projectColors} fonts={fonts} />
        </div>
      </div>
      <div className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded z-10">
        {index + 1}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Trash2 className="h-3 w-3" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-3 w-3" />
      </div>
    </div>
  );
}

interface SortableSlideListProps {
  slides: SlideContent[];
  selectedSlideIndex: number;
  projectColors: {
    primary?: string;
    background?: string;
    text?: string;
  };
  projectFonts?: {
    heading?: string;
    body?: string;
  };
  deckFonts?: {
    heading?: string;
    body?: string;
  };
  onSelectSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onReorderSlides: (fromIndex: number, toIndex: number) => void;
}

export function SortableSlideList({
  slides,
  selectedSlideIndex,
  projectColors,
  projectFonts,
  deckFonts,
  onSelectSlide,
  onDeleteSlide,
  onReorderSlides,
}: SortableSlideListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const slideIds = useMemo(() => slides.map((slide) => slide.id), [slides]);

  const activeSlide = useMemo(
    () => (activeId ? slides.find((slide) => slide.id === activeId) : null),
    [activeId, slides]
  );

  const fonts = {
    heading: deckFonts?.heading || projectFonts?.heading || 'Inter',
    body: deckFonts?.body || projectFonts?.body || 'Inter',
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((slide) => slide.id === active.id);
      const newIndex = slides.findIndex((slide) => slide.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderSlides(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={slideIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {slides.map((slide, index) => (
            <SortableSlideItem
              key={slide.id}
              slide={slide}
              index={index}
              isSelected={index === selectedSlideIndex}
              projectColors={projectColors}
              fonts={fonts}
              onSelect={() => onSelectSlide(index)}
              onDelete={() => onDeleteSlide(index)}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeSlide ? (
          <div className="aspect-video rounded-lg border border-[var(--primary)] ring-2 ring-[var(--primary)]/20 overflow-hidden w-64 opacity-90">
            <div className="absolute inset-0 scale-[0.2] origin-top-left w-[500%] h-[500%]">
              <div className="w-full h-full">
                {(() => {
                  const Comp = slideComponents[activeSlide.type] || slideComponents.content;
                  return <Comp data={activeSlide.data} colors={projectColors} fonts={fonts} />;
                })()}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

