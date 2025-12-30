'use client';

import { GripVertical, X } from 'lucide-react';
import { useMemo } from 'react';
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

interface StatItem {
  value: string;
  label: string;
}

interface SortableStatItemProps {
  stat: StatItem;
  index: number;
  onUpdate: (stat: StatItem) => void;
  onDelete: () => void;
}

function SortableStatItem({ stat, index, onUpdate, onDelete }: SortableStatItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `stat-${index}`,
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
        value={stat.value}
        onChange={(e) => onUpdate({ ...stat, value: e.target.value })}
        placeholder="Value"
        className="flex-1"
      />
      <Input
        value={stat.label}
        onChange={(e) => onUpdate({ ...stat, label: e.target.value })}
        placeholder="Label"
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

interface SortableStatsListProps {
  stats: StatItem[];
  onStatsChange: (stats: StatItem[]) => void;
}

export function SortableStatsList({ stats, onStatsChange }: SortableStatsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const statIds = useMemo(() => stats.map((_, index) => `stat-${index}`), [stats]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = statIds.indexOf(active.id as string);
      const newIndex = statIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newStats = arrayMove(stats, oldIndex, newIndex);
        onStatsChange(newStats);
      }
    }
  }

  function handleUpdate(index: number, stat: StatItem) {
    const newStats = [...stats];
    newStats[index] = stat;
    onStatsChange(newStats);
  }

  function handleDelete(index: number) {
    const newStats = stats.filter((_, i) => i !== index);
    onStatsChange(newStats);
  }

  function handleAdd() {
    onStatsChange([...stats, { value: '', label: '' }]);
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={statIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <SortableStatItem
                key={`stat-${index}`}
                stat={stat}
                index={index}
                onUpdate={(updatedStat) => handleUpdate(index, updatedStat)}
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
        + Add Stat
      </button>
    </div>
  );
}

