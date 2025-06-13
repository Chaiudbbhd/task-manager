
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { Calendar, Clock, User, Edit } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTask();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleStatus = () => {
    const statusFlow = { 'todo': 'in-progress', 'in-progress': 'completed', 'completed': 'todo', 'blocked': 'todo' };
    updateTask(task.id, { status: statusFlow[task.status] as Task['status'] });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">{task.title}</h3>
          <Badge className={`ml-2 ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mt-2">{task.description}</p>
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className={getStatusColor(task.status)}>
            {task.status.replace('-', ' ').toUpperCase()}
          </Badge>
          {task.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {task.dueDate && (
            <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              {isOverdue && <span className="text-red-600 font-bold">OVERDUE</span>}
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{task.assignee}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2">
        <Button onClick={toggleStatus} variant="outline" size="sm" className="flex-1">
          Mark as {task.status === 'completed' ? 'Todo' : task.status === 'todo' ? 'In Progress' : 'Complete'}
        </Button>
        <Button onClick={() => onEdit(task)} variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button onClick={() => deleteTask(task.id)} variant="destructive" size="sm">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
