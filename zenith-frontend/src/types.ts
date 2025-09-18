// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
}

// Type for the user object we'll get from the decoded JWT
export interface User {
  userId: number;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  fullName: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
  displayOrder: number;
}

export interface WorkItem {
  id: number;
  itemKey: number;
  title: string;
  description: string;
  type: 'STORY' | 'TASK' | 'BUG';
  status: ProjectStatus;
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: User | null;
  reporter: User;
  parent: WorkItem | null;
  parentId: number | null;
  children: WorkItem[];
  labels: Label[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
