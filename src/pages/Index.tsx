import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TaskProvider } from '@/contexts/TaskContext';
import { useAuth } from '@/hooks/useAuth';
import TaskStats from '@/components/TaskStats';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/types/task';
import { Plus, LogOut, User } from 'lucide-react';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { user, signOut } = useAuth();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">LPK Task Manager</h1>
              <p className="text-sm text-slate-500">Stay organized. Get things done.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow rounded-lg transition-all duration-200 flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-indigo-700">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                  </DialogHeader>
                  <TaskForm task={editingTask} onClose={handleCloseForm} />
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2 border-slate-300 hover:border-slate-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <div className="w-full mb-6">
    <img 
      src="https://img.freepik.com/free-vector/checklist-concept-illustration_114360-27941.jpg?semt=ais_hybrid&w=740" 
      alt="Task Manager Banner" 
      className="rounded-lg shadow-md w-full object-cover max-h-64"
    />
  </div>

  <section>
    <h2 className="text-2xl font-semibold text-slate-800 mb-4">Dashboard Overview</h2>
    <TaskStats />
  </section>

  <section>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-slate-800">Your Tasks</h2>
    </div>
    <TaskList onEdit={handleEditTask} />
  </section>
</main>


        {/* Footer */}
        <footer className="bg-white border-t shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} LPK Task Manager — Powered by React, Vite & TypeScript
          </div>
        </footer>
      </div>
    </TaskProvider>
  );
};

export default Index;
