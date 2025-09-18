import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notification, Spin, Typography } from 'antd';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from '../components/kanban/KanbanColumn';
import * as workItemService from '../services/workItemService';
import * as projectService from '../services/projectService';
import { WorkItem, ProjectStatus } from '../types';
import WorkItemDetailModal from '../components/WorkItemDetailModal';

const { Title } = Typography;

type WorkItemsByStatus = Record<string, WorkItem[]>;

const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [workItems, setWorkItems] = useState<WorkItemsByStatus>({});
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkItem, setActiveWorkItem] = useState<WorkItem | null>(null);
  const [selectedWorkItemId, setSelectedWorkItemId] = useState<number | null>(null);

  const handleCardClick = (workItemId: number) => {
    setSelectedWorkItemId(workItemId);
  };

  const handleModalClose = () => {
    setSelectedWorkItemId(null);
  };

  const handleWorkItemUpdate = (updatedWorkItem: WorkItem) => {
    // This is a simple update. A more robust solution would re-fetch or merge deeply.
    const containerId = findContainer(updatedWorkItem.id);
    if(containerId) {
      setWorkItems(prev => ({
        ...prev,
        [containerId]: prev[containerId].map(item => item.id === updatedWorkItem.id ? updatedWorkItem : item)
      }));
    }
    // We could also re-fetch all data here
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const [fetchedStatuses, fetchedWorkItems] = await Promise.all([
          projectService.getProjectStatuses(Number(projectId)),
          workItemService.getWorkItems(Number(projectId)),
        ]);

        setStatuses(fetchedStatuses);
        const itemsByStatus = fetchedStatuses.reduce((acc, status) => {
          acc[status.id] = fetchedWorkItems.filter(item => item.status.id === status.id).sort((a,b) => a.itemKey - b.itemKey); // Assuming some order
          return acc;
        }, {} as WorkItemsByStatus);
        setWorkItems(itemsByStatus);
      } catch (error) {
        notification.error({ message: 'Failed to load board data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const findContainer = (id: number | string) => {
    if (String(id) in workItems) {
      return String(id);
    }
    for (const containerId in workItems) {
      if (workItems[containerId].some(item => item.id === id)) {
        return containerId;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const containerId = findContainer(active.id);
    if (containerId) {
        setActiveWorkItem(workItems[containerId].find(item => item.id === active.id) || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !activeWorkItem) {
      setActiveWorkItem(null);
      return;
    }

    const activeContainerId = findContainer(active.id);
    const overContainerId = findContainer(over.id);

    if (!activeContainerId || !overContainerId || activeContainerId !== overContainerId) {
        // This case is handled by onDragOver
        return;
    }

    // Handle reordering in the same column
    const activeIndex = workItems[activeContainerId].findIndex(item => item.id === active.id);
    const overIndex = workItems[overContainerId].findIndex(item => item.id === over.id);

    if (activeIndex !== overIndex) {
      setWorkItems(items => ({
        ...items,
        [overContainerId]: arrayMove(items[overContainerId], activeIndex, overIndex),
      }));
    }
    setActiveWorkItem(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeWorkItem) return;

    const activeContainerId = findContainer(active.id);
    const overContainerId = findContainer(over.id);

    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
      return; // Handled by onDragEnd
    }

    // Move to a new column
    setWorkItems(prev => {
      const activeItems = prev[activeContainerId];
      const overItems = prev[overContainerId];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);

      return {
        ...prev,
        [activeContainerId]: activeItems.filter(item => item.id !== active.id),
        [overContainerId]: [...overItems, activeItems[activeIndex]],
      };
    });

    // API Call for status change
    const newStatusId = Number(overContainerId);
    workItemService.updateWorkItem(activeWorkItem.id, { statusId: newStatusId })
      .catch(() => {
        // Quick revert, could be improved with a more robust state history
        notification.error({ message: `Failed to move ${activeWorkItem.title} to new status.` });
        // TODO: Implement a proper revert
      });
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
  }

  return (
    <div>
      <Title level={2}>Project Board</Title>
       <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', overflowX: 'auto', padding: '16px 0' }}>
            {statuses.map(status => (
              <KanbanColumn
                key={status.id}
                id={String(status.id)}
                title={status.name}
                items={workItems[status.id] || []}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
      </DndContext>
      <WorkItemDetailModal
        workItemId={selectedWorkItemId}
        onClose={handleModalClose}
        onUpdate={handleWorkItemUpdate}
      />
    </div>
  );
};

export default ProjectBoardPage;
