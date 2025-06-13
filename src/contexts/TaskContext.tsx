
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStats } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskStats: () => TaskStats;
  filterTasks: (status?: string, priority?: string) => Task[];
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        priority: task.priority as Task['priority'],
        status: task.status as Task['status'],
        dueDate: task.due_date || undefined,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        assignee: task.assignee || undefined,
        tags: task.tags || []
      }));

      setTasks(formattedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when user changes
  useEffect(() => {
    refreshTasks();
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          status: taskData.status,
          due_date: taskData.dueDate || null,
          assignee: taskData.assignee || null,
          tags: taskData.tags
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        priority: data.priority as Task['priority'],
        status: data.status as Task['status'],
        dueDate: data.due_date || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        assignee: data.assignee || undefined,
        tags: data.tags || []
      };

      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          priority: updates.priority,
          status: updates.status,
          due_date: updates.dueDate || null,
          assignee: updates.assignee || null,
          tags: updates.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ));

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getTaskStats = (): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'completed';
    }).length;

    return { total, completed, inProgress, overdue };
  };

  const filterTasks = (status?: string, priority?: string): Task[] => {
    return tasks.filter(task => {
      if (status && task.status !== status) return false;
      if (priority && task.priority !== priority) return false;
      return true;
    });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      getTaskStats,
      filterTasks,
      refreshTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
