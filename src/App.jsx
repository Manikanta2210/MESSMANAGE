import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StatsOverview from './components/dashboard/StatsOverview';
import RecentTasks from './components/dashboard/RecentTasks';
import UpcomingDeadlines from './components/dashboard/UpcomingDeadlines';
import AnalyticsCards from './components/dashboard/AnalyticsCards';
import TaskFilterBar from './components/tasks/TaskFilterBar';
import TaskList from './components/tasks/TaskList';
import TaskModal from './components/tasks/TaskModal';
import ConfirmModal from './components/common/ConfirmModal';
import Toast from './components/common/Toast';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetToSampleTasks,
} from './utils/storage';
import { isOverdue } from './utils/dateUtils';
import { PRIORITY_CONFIG } from './utils/constants';
import { Plus, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function App() {
  // State
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');
  const [viewMode, setViewMode] = useState('grid');

  // Modals & Popups
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage on task changes
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Toast trigger helper
  function showToast(title, message = '', type = 'success') {
    setToast({ title, message, type });
  }

  // Navigation helper
  function handleNavigate(viewId, extraFilters = {}) {
    setCurrentView(viewId);
    if (viewId === 'all') {
      if (extraFilters.category) {
        setCategoryFilter(extraFilters.category);
      }
      if (extraFilters.status) {
        setStatusFilter(extraFilters.status);
      }
    } else if (viewId === 'upcoming') {
      setStatusFilter('pending');
      setSortBy('dueDateAsc');
    } else if (viewId === 'completed') {
      setStatusFilter('completed');
      setSortBy('dueDateDesc');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Task Actions
  function handleCreateOrUpdateTask(taskData) {
    if (editingTask) {
      // Update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? taskData : t))
      );
      showToast('Task updated', `"${taskData.title}" was updated successfully.`);
    } else {
      // Create
      setTasks((prev) => [taskData, ...prev]);
      showToast('Task created', `"${taskData.title}" added to your workspace.`);
    }
  }

  function handleToggleComplete(taskId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'completed' ? 'pending' : 'completed';
          const title =
            newStatus === 'completed'
              ? 'Task completed! 🎉'
              : 'Task marked as pending';
          showToast(title, `"${t.title}" status updated.`);
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  }

  function handleOpenEdit(task) {
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  function handleOpenDelete(task) {
    setDeleteConfirmTask(task);
  }

  function handleConfirmDelete() {
    if (!deleteConfirmTask) return;
    const taskToDelete = deleteConfirmTask;
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setDeleteConfirmTask(null);
    showToast('Task deleted', `"${taskToDelete.title}" has been deleted.`, 'error');
  }

  function handleConfirmReset() {
    const refreshed = resetToSampleTasks();
    setTasks(refreshed);
    setResetConfirmOpen(false);
    showToast('Workspace reset', 'Loaded initial sample tasks.', 'info');
  }

  // Stats Card quick filter clicks
  function handleStatsCardClick(target) {
    if (target === 'all') {
      setStatusFilter('all');
      handleNavigate('all');
    } else if (target === 'pending') {
      setStatusFilter('pending');
      handleNavigate('all');
    } else if (target === 'completed') {
      setStatusFilter('completed');
      handleNavigate('completed');
    } else if (target === 'overdue') {
      setStatusFilter('pending');
      handleNavigate('upcoming');
    }
  }

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (task.title || '').toLowerCase().includes(q);
          const matchDesc = (task.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // View context
        if (currentView === 'completed') {
          if (task.status !== 'completed') return false;
        } else if (currentView === 'upcoming') {
          if (task.status === 'completed') return false;
        }

        // Status filter (when on 'all' view or overridden)
        if (currentView === 'all') {
          if (statusFilter === 'pending' && task.status !== 'pending') return false;
          if (statusFilter === 'completed' && task.status !== 'completed') return false;
          if (statusFilter === 'high-priority' && task.priority !== 'High') return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }
        if (sortBy === 'dueDateDesc') {
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        }
        if (sortBy === 'priorityDesc') {
          const pA = PRIORITY_CONFIG[a.priority]?.order || 0;
          const pB = PRIORITY_CONFIG[b.priority]?.order || 0;
          return pB - pA;
        }
        if (sortBy === 'createdAtDesc') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'titleAsc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [tasks, currentView, searchQuery, statusFilter, categoryFilter, sortBy]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    (currentView === 'all' && statusFilter !== 'all');

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        tasks={tasks}
        onAddTask={() => {
          setEditingTask(null);
          setTaskModalOpen(true);
        }}
        onResetData={() => setResetConfirmOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          currentView={currentView}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onAddTask={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
          tasks={tasks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={handleNavigate}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Stats Overview */}
              <StatsOverview
                tasks={tasks}
                onFilterClick={handleStatsCardClick}
              />

              {/* Middle Row: Analytics Cards */}
              <AnalyticsCards
                tasks={tasks}
                onFilterCategory={(cat) => handleNavigate('all', { category: cat })}
                onFilterPriority={(prio) => {
                  if (prio === 'High') {
                    handleNavigate('all', { status: 'high-priority' });
                  } else {
                    handleNavigate('all');
                  }
                }}
              />

              {/* Bottom Row: Recent & Upcoming split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentTasks
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onViewAll={() => handleNavigate('all')}
                  onEdit={handleOpenEdit}
                />
                <UpcomingDeadlines
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onViewAll={() => handleNavigate('upcoming')}
                  onEdit={handleOpenEdit}
                />
              </div>
            </div>
          )}

          {/* ALL TASKS / UPCOMING / COMPLETED VIEWS */}
          {currentView !== 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header intro & action banner for current view */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {currentView === 'all' && 'All Backlog & Tasks'}
                    {currentView === 'upcoming' && 'Upcoming Deadlines & Milestones'}
                    {currentView === 'completed' && 'Completed Achievements'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {currentView === 'all' &&
                      'Filter, search, organize, and prioritize all workspace tasks.'}
                    {currentView === 'upcoming' &&
                      'Tasks requiring attention sorted by closest due date.'}
                    {currentView === 'completed' &&
                      'Archive of all successfully accomplished deliverables.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs shadow-indigo-200 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* Filter and Control Bar */}
              <TaskFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={filteredTasks.length}
              />

              {/* Task Items */}
              <TaskList
                tasks={filteredTasks}
                viewMode={viewMode}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onAddTask={() => {
                  setEditingTask(null);
                  setTaskModalOpen(true);
                }}
                isFiltered={isFiltered}
              />
            </div>
          )}
        </main>
      </div>

      {/* Task Add/Edit Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmTask)}
        title="Delete Task"
        message={
          deleteConfirmTask
            ? `Are you sure you want to permanently delete "${deleteConfirmTask.title}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Yes, Delete Task"
        cancelLabel="Keep Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmTask(null)}
        isDanger={true}
      />

      {/* Reset Data Confirmation Modal */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset to Sample Tasks?"
        message="This will reload the initial sample tasks into your local storage. Any custom tasks you created will be replaced."
        confirmLabel="Reset Tasks"
        cancelLabel="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetConfirmOpen(false)}
        isDanger={false}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
