import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { notification, Spin, Typography } from 'antd';
import { AntTreeNodeDropEvent } from 'antd/es/tree';
import * as workItemService from '../services/workItemService';
import { WorkItem } from '../types';
import { buildWorkItemTree, WorkItemTreeNode } from '../utils/transformToTree';
import WBSView from '../components/wbs/WBSView';

const { Title } = Typography;

const ProjectWBSPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [treeData, setTreeData] = useState<WorkItemTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const items = await workItemService.getWorkItems(Number(projectId));
      setWorkItems(items);
      setTreeData(buildWorkItemTree(items));
    } catch (error) {
      notification.error({ message: 'Failed to load WBS data.' });
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDrop = (info: AntTreeNodeDropEvent) => {
    const { dragNode, node, dropToGap } = info;

    // If dropped in a gap between nodes, we can treat it as becoming a sibling.
    // The new parent would be the parent of the node we are dropping near.
    // If dropped ON a node, it becomes a child.
    const newParentId = dropToGap ? node.workItem.parent?.id ?? null : Number(node.key);
    const draggedItemId = Number(dragNode.key);

    if (draggedItemId === newParentId) {
        notification.error({ message: "Cannot make an item its own child." });
        return;
    }

    // Optimistic Update
    const originalItems = [...workItems];
    const newParent = originalItems.find(i => i.id === newParentId) || null;

    const updatedItems = originalItems.map(item =>
      item.id === draggedItemId
        ? { ...item, parent: newParent, parentId: newParentId } // Update both parent and parentId
        : item
    );
    setWorkItems(updatedItems);
    setTreeData(buildWorkItemTree(updatedItems));

    // API Call
    workItemService.updateWorkItem(draggedItemId, { parentId: newParentId })
      .then(() => {
        notification.success({ message: 'Work item parent updated.' });
        // Optionally re-fetch to get the most accurate data
        fetchData();
      })
      .catch(() => {
        // Revert
        setWorkItems(originalItems);
        setTreeData(buildWorkItemTree(originalItems));
        notification.error({ message: 'Failed to update item parent.' });
      });
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
  }

  return (
    <div>
      <Title level={2}>Work Breakdown Structure</Title>
      <WBSView treeData={treeData} onDrop={handleDrop} />
    </div>
  );
};

export default ProjectWBSPage;
