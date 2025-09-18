import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, notification } from 'antd';
import * as workItemService from '../services/workItemService';
import { WorkItem } from '../types';
// import Gantt from 'simple-react-gantt'; // Assuming this is our library

const { Title } = Typography;

// Mock Gantt Component as the library is hypothetical
const MockGanttChart = ({ tasks }: { tasks: any[] }) => {
    return (
        <div style={{ border: '1px solid #f0f0f0', padding: 16, borderRadius: 8 }}>
            <Title level={4}>Gantt Chart View</Title>
            <div style={{ position: 'relative', height: `${tasks.length * 40}px` }}>
                {tasks.map((task, index) => (
                    <div key={task.id} style={{
                        position: 'absolute',
                        top: `${index * 40}px`,
                        left: `${task.startOffset || 0}%`, // Simplified positioning
                        width: `${task.duration || 10}%`,
                        height: '30px',
                        backgroundColor: '#00C49F',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        color: 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {task.name}
                    </div>
                ))}
            </div>
            <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                Note: This is a simplified visual representation of a Gantt chart.
            </Text>
        </div>
    );
};


const ProjectGanttPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const items = await workItemService.getWorkItems(Number(projectId));

        // Transform data for Gantt chart
        const ganttTasks = items.map(item => ({
          id: String(item.id),
          name: `ZEN-${item.itemKey}: ${item.title}`,
          start: new Date(item.createdAt), // Use createdAt as start date
          end: item.dueDate ? new Date(item.dueDate) : new Date(new Date(item.createdAt).setDate(new Date(item.createdAt).getDate() + 3)), // Default duration
          progress: item.status.name.toLowerCase() === 'done' ? 100 : 0,
          dependencies: item.parentId ? String(item.parentId) : undefined,
        }));

        // A simple layout calculation for the mock chart
        const projectStartDate = Math.min(...ganttTasks.map(t => t.start.getTime()));
        const projectEndDate = Math.max(...ganttTasks.map(t => t.end.getTime()));
        const totalProjectDuration = projectEndDate - projectStartDate;

        const tasksWithOffset = ganttTasks.map(task => {
            const startOffset = totalProjectDuration > 0 ? ((task.start.getTime() - projectStartDate) / totalProjectDuration) * 100 : 0;
            const duration = totalProjectDuration > 0 ? ((task.end.getTime() - task.start.getTime()) / totalProjectDuration) * 100 : 10;
            return { ...task, startOffset, duration };
        });

        setTasks(tasksWithOffset);
      } catch (error) {
        notification.error({ message: 'Failed to load Gantt chart data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  return (
    <div>
      <Title level={2}>Gantt Chart</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', marginTop: 50 }} />
      ) : (
        <MockGanttChart tasks={tasks} />
      )}
    </div>
  );
};

export default ProjectGanttPage;
