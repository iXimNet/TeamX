import api from './api';
import { Comment } from '../types'; // I will need to add this type

export const getComments = async (workItemId: number): Promise<Comment[]> => {
  const response = await api.get(`/work-items/${workItemId}/comments`);
  return response.data;
};

export const createComment = async (workItemId: number, content: string): Promise<Comment> => {
  const response = await api.post(`/work-items/${workItemId}/comments`, { content });
  return response.data;
};
