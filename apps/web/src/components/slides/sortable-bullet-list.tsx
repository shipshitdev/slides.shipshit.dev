'use client';

import { GripVertical, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
import { Input } from '@/components/ui/input';

interface SortableBulletItemProps {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  onDelete: () => void;
}

function SortableBulletItem({ bullet, index, onUpdate, onDelete }: SortableBulletItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `bullet-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('flex items-center gap-2', isDragging && 'opacity-50')}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Input
        value={bullet}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`Bullet point ${index + 1}...`}
        className="flex-1"
      />
      <button
        onClick={onDelete}
        className="p-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface SortableBulletListProps {
  bullets: string[];
  onBulletsChange: (bullets: string[]) => void;
}

export function SortableBulletList({ bullets, onBulletsChange }: SortableBulletListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bulletIds = useMemo(() => bullets.map((_, index) => `bullet-${index}`), [bullets]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = bulletIds.indexOf(active.id as string);
      const newIndex = bulletIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBullets = arrayMove(bullets, oldIndex, newIndex);
        onBulletsChange(newBullets);
      }
    }
  }

  function handleUpdate(index: number, value: string) {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onBulletsChange(newBullets);
  }

  function handleDelete(index: number) {
    const newBullets = bullets.filter((_, i) => i !== index);
    onBulletsChange(newBullets);
  }

  function handleAdd() {
    onBulletsChange([...bullets, '']);
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {bullets.map((bullet, index) => (
              <SortableBulletItem
                key={`bullet-${index}`}
                bullet={bullet}
                index={index}
                onUpdate={(value) => handleUpdate(index, value)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        onClick={handleAdd}
        className="w-full text-xs p-2 border border-[var(--border)] rounded hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
        type="button"
      >
        + Add Bullet
      </button>
    </div>
  );
}

