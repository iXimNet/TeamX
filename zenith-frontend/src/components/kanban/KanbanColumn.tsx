import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { WorkItem } from '../../types';
import SortableWorkItem from './SortableWorkItem';

interface Props {
  id: string; // Status ID
  title: string;
  items: WorkItem[];
  onCardClick: (workItemId: number) => void;
}

const KanbanColumn: React.FC<Props> = ({ id, title, items, onCardClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      id={id}
      items={items.map(i => i.id)} // Use numeric IDs
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        style={{
          width: 280,
          margin: '0 8px',
          padding: '8px',
          backgroundColor: '#f0f2f5',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 100, // Give a min height for empty columns to be droppable
        }}
      >
        <h3 style={{ padding: '0 8px', marginBottom: 16 }}>{title} ({items.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {items.map(item => (
            <SortableWorkItem key={item.id} workItem={item} onClick={() => onCardClick(item.id)} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default KanbanColumn;
