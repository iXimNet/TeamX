import api from './api';
import { WorkItem } from '../types';

type UpdateWorkItemPayload = Partial<Omit<WorkItem, 'id' | 'itemKey' | 'project' | 'reporter' | 'createdAt' | 'updatedAt'>> & {
    statusId?: number;
};

export const getWorkItems = async (projectId: number): Promise<WorkItem[]> => {
    const response = await api.get(`/projects/${projectId}/work-items`);
    return response.data;
};

export const updateWorkItem = async (workItemId: number, payload: UpdateWorkItemPayload): Promise<WorkItem> => {
    const response = await api.patch(`/work-items/${workItemId}`, payload);
    return response.data;
};
