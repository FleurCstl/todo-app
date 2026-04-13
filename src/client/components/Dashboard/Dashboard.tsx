import React, { useMemo } from 'react';
import { TodoList, Task } from '../../types';
import { Clock, ExternalLink, AlertCircle, Calendar, Circle, LayoutDashboard } from 'lucide-react';
import { DropdownMenu, DropdownItem } from '../ui/DropdownMenu/DropdownMenu';
import './Dashboard.css';

interface DashboardProps {
  lists: TodoList[];
  tasks: Task[];
  onSelectList: (id: number) => void;
  onToggleTask: (id: number) => void;
}

export function Dashboard({ lists, tasks, onSelectList, onToggleTask }: DashboardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { overdueTasks, upcomingTasks } = useMemo(() => {
    const incompleteTasks = tasks.filter(t => !t.completed && t.deadline);
    
    const overdue = incompleteTasks.filter(t => {
      const deadline = new Date(t.deadline!);
      deadline.setHours(0, 0, 0, 0);
      return deadline < today;
    }).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

    const upcoming = incompleteTasks.filter(t => {
      const deadline = new Date(t.deadline!);
      deadline.setHours(0, 0, 0, 0);
      return deadline >= today;
    }).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

    return { overdueTasks: overdue, upcomingTasks: upcoming };
  }, [tasks, today]);

  const getListName = (listId: number) => {
    return lists.find(l => l.id === listId)?.title || 'Unknown List';
  };

  const getListColor = (listId: number) => {
    return lists.find(l => l.id === listId)?.color || 'var(--color-primary)';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="dashboard-task-card group">
      <button 
        onClick={() => onToggleTask(task.id)}
        className="task-toggle"
      >
        <Circle size={22} className="text-border-subtle hover:text-primary transition-colors" />
      </button>
      
      <div className="task-info">
        <div className="task-main">
          <span className="task-title">{task.title}</span>
          <div className="task-metadata">
            <span 
              className="list-badge" 
              style={{ '--list-color': getListColor(task.listId) } as React.CSSProperties}
            >
              {getListName(task.listId)}
            </span>
            <span className={`deadline-badge ${new Date(task.deadline!) < today ? 'overdue' : ''}`}>
              <Clock size={12} />
              {formatDate(task.deadline!)}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <DropdownMenu>
          <DropdownItem 
            icon={ExternalLink} 
            onClick={() => onSelectList(task.listId)}
          >
            Go to list
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container animate-in">
      <header className="dashboard-header">
        <div className="header-icon">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Focus on what's important today</p>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-header overdue">
            <AlertCircle size={18} />
            <h2>Overdue Tasks</h2>
            <span className="count-badge">{overdueTasks.length}</span>
          </div>
          <div className="task-grid">
            {overdueTasks.length > 0 ? (
              overdueTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="empty-state">No overdue tasks. Great job! 🚀</p>
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header upcoming">
            <Calendar size={18} />
            <h2>Upcoming Tasks</h2>
            <span className="count-badge">{upcomingTasks.length}</span>
          </div>
          <div className="task-grid">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="empty-state">No upcoming tasks with deadlines. 📅</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
