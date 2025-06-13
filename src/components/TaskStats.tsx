
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const TaskStats: React.FC = () => {
  const { getTaskStats } = useTask();
  const stats = getTaskStats();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productivity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Completion Rate</span>
              <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
