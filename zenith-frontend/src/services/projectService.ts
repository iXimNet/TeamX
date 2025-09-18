import api from './api';
import { ProjectStatus } from '../types'; // I will need to add this type

export const getProjectStatuses = async (projectId: number): Promise<ProjectStatus[]> => {
    const response = await api.get(`/projects/${projectId}/statuses`);
    return response.data;
};
