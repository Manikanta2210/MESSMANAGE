import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';
import { CheckCircle2, SearchX, Plus } from 'lucide-react';

export default function TaskList({
  tasks,
  viewMode = 'grid',
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
  isFiltered = false,
}) {
  if (tasks.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={SearchX}
          title="No tasks match your filters"
          description="Try modifying your search query, priority, or category filters to find what you need."
        />
      );
    }
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No tasks yet"
        description="Your task list is clean and clear! Create your first task to begin organizing your work."
        actionText="Create First Task"
        onAction={onAddTask}
      />
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col space-y-3'
      }
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
