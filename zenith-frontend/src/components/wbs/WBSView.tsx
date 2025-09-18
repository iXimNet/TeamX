import React from 'react';
import { Tree, Tag, Space, Typography } from 'antd';
import { AntTreeNodeDropEvent } from 'antd/es/tree';
import { WorkItemTreeNode } from '../../utils/transformToTree';

const { Text } = Typography;

interface WBSViewProps {
  treeData: WorkItemTreeNode[];
  onDrop: (info: AntTreeNodeDropEvent) => void;
}

const WBSView: React.FC<WBSViewProps> = ({ treeData, onDrop }) => {
  const renderTitle = (node: WorkItemTreeNode) => {
    return (
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <span>
          <Text strong>{`ZEN-${node.workItem.itemKey}`}</Text>
          <Text style={{ marginLeft: 8 }}>{node.workItem.title}</Text>
        </span>
        <Tag>{node.workItem.status.name}</Tag>
      </Space>
    );
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDrop={onDrop}
      treeData={treeData}
      titleRender={renderTitle}
      defaultExpandAll
    />
  );
};

export default WBSView;
