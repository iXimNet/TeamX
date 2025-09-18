import React from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { ProjectStatus, WorkItem } from '../../types';

interface KanbanBoardProps {
  statuses: ProjectStatus[];
  items: Record<string, WorkItem[]>; // Keyed by status.id
  onDragEnd: (event: DragEndEvent) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ statuses, items, onDragEnd }) => {
  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <div style={{ display: 'flex', overflowX: 'auto', padding: '16px 0' }}>
        {statuses.map(status => (
          <KanbanColumn
            key={status.id}
            id={String(status.id)}
            title={status.name}
            items={items[status.id] || []}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
