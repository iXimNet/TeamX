import api from './api';

export interface StatusDistributionData {
  statusName: string;
  count: number;
}

export interface BurndownData {
  totalEffort: number;
  completedEffort: number;
  remainingEffort: number;
}

export const getStatusDistribution = async (projectId: number): Promise<StatusDistributionData[]> => {
  const response = await api.get(`/projects/${projectId}/dashboard/status-distribution`);
  return response.data;
};

export const getBurndownData = async (projectId: number): Promise<BurndownData> => {
  const response = await api.get(`/projects/${projectId}/dashboard/burndown`);
  return response.data;
};
