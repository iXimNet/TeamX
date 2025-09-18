import { DataNode } from 'antd/es/tree';
import { WorkItem } from '../types';

export interface WorkItemTreeNode extends DataNode {
  workItem: WorkItem;
  children: WorkItemTreeNode[];
}

export const buildWorkItemTree = (workItems: WorkItem[]): WorkItemTreeNode[] => {
  const map = new Map<number, WorkItemTreeNode>();
  const roots: WorkItemTreeNode[] = [];

  // First pass: create a node for each item and add to map
  workItems.forEach(item => {
    map.set(item.id, {
      key: item.id,
      title: item.title, // We will customize rendering later
      workItem: item,
      children: [],
    });
  });

  // Second pass: link children to their parents
  workItems.forEach(item => {
    const node = map.get(item.id);
    if (node) {
      if (item.parent?.id) {
        const parentNode = map.get(item.parent.id);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          // Parent not in the current list, so it's a root for now
          roots.push(node);
        }
      } else {
        // No parent, it's a root
        roots.push(node);
      }
    }
  });

  return roots;
};
