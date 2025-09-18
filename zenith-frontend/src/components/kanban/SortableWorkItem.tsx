import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WorkItemCard from './WorkItemCard';
import { WorkItem } from '../../types';

interface Props {
  workItem: WorkItem;
  onClick: () => void;
}

const SortableWorkItem: React.FC<Props> = ({ workItem, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <WorkItemCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      workItem={workItem}
      onClick={onClick}
    />
  );
};

export default SortableWorkItem;
