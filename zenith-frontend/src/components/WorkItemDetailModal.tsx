import React, { useEffect, useState } from 'react';
import { Modal, Spin, Typography, Row, Col, Tag, Avatar, Divider, Form, Input, Button, List, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as workItemService from '../services/workItemService';
import * as commentService from '../services/commentService';
import { WorkItem, Comment as CommentType } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Props {
  workItemId: number | null;
  onClose: () => void;
  onUpdate: (updatedWorkItem: WorkItem) => void;
}

const WorkItemDetailModal: React.FC<Props> = ({ workItemId, onClose, onUpdate }) => {
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    if (workItemId) {
      setLoading(true);
      Promise.all([
        workItemService.getWorkItem(workItemId),
        commentService.getComments(workItemId),
      ]).then(([itemData, commentsData]) => {
        setWorkItem(itemData);
        setComments(commentsData);
      }).catch(() => {
        notification.error({ message: 'Failed to load work item details.' });
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [workItemId]);

  const handlePostComment = async (values: { content: string }) => {
    if (!workItemId) return;
    setCommenting(true);
    try {
      const newComment = await commentService.createComment(workItemId, values.content);
      setComments(prev => [...prev, newComment]);
      form.resetFields();
    } catch {
      notification.error({ message: 'Failed to post comment.' });
    } finally {
      setCommenting(false);
    }
  };

  return (
    <Modal
      open={!!workItemId}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      {loading || !workItem ? (
        <Spin />
      ) : (
        <>
          <Title level={3}>ZEN-{workItem.itemKey}: {workItem.title}</Title>
          <Row gutter={16}>
            <Col span={16}>
              <Text strong>Description</Text>
              <Paragraph>{workItem.description || 'No description.'}</Paragraph>
              <Divider />
              <Title level={4}>Comments</Title>
              <List
                dataSource={comments}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.user.fullName}
                      description={<>
                        <p>{item.content}</p>
                        <Text type="secondary">{new Date(item.createdAt).toLocaleString()}</Text>
                      </>}
                    />
                  </List.Item>
                )}
              />
              <Form form={form} onFinish={handlePostComment} style={{ marginTop: 24 }}>
                <Form.Item name="content" rules={[{ required: true }]}>
                  <TextArea rows={3} placeholder="Add a comment..." />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" loading={commenting} type="primary">
                    Post Comment
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <Text strong>Status:</Text> <Tag>{workItem.status.name}</Tag>
              <Divider />
              <Text strong>Assignee:</Text> {workItem.assignee ? workItem.assignee.fullName : 'Unassigned'}
              <Divider />
              <Text strong>Reporter:</Text> {workItem.reporter.fullName}
              <Divider />
              <Text strong>Priority:</Text> {workItem.priority}
              <Divider />
              <Text strong>Labels:</Text> {workItem.labels.map(l => <Tag key={l.id} color={l.color}>{l.name}</Tag>)}
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
};

export default WorkItemDetailModal;
