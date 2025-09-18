import React from 'react';
import { Card, Avatar, Tooltip, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { WorkItem } from '../../types';

// Allow dnd-kit props to be passed
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  workItem: WorkItem;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'HIGHEST': return 'red';
        case 'HIGH': return 'orange';
        case 'MEDIUM': return 'blue';
        case 'LOW': return 'grey';
        default: return 'default';
    }
}

const WorkItemCard = React.forwardRef<HTMLDivElement, Props>(({ workItem, ...props }, ref) => {
  const { title, itemKey, assignee, priority } = workItem;

  return (
    <div ref={ref} {...props} style={{ marginBottom: 8 }}>
      <Card hoverable size="small">
        <p><strong>{title}</strong></p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Tag color={getPriorityColor(priority)}>{priority}</Tag>
          <Tooltip title={assignee?.fullName || 'Unassigned'}>
            <Avatar size="small" icon={<UserOutlined />} />
          </Tooltip>
        </div>
      </Card>
    </div>
  );
});

export default WorkItemCard;
