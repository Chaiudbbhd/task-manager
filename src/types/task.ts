
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  tags: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}
