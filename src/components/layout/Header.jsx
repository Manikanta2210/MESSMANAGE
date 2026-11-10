import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Bell,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { isOverdue, isDueToday } from '../../utils/dateUtils';

export default function Header({
  currentView,
  onOpenMobileSidebar,
  onAddTask,
  tasks,
  searchQuery,
  onSearchChange,
  onNavigate,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const urgentTasks = tasks.filter(
    (t) => t.status !== 'completed' && (isOverdue(t.dueDate, t.status) || isDueToday(t.dueDate))
  );

  const viewTitles = {
    dashboard: 'Dashboard',
    all: 'All Tasks',
    upcoming: 'Upcoming Deadlines',
    completed: 'Completed Tasks',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & View title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {viewTitles[currentView] || 'Tasks'}
            </h2>
          </div>
        </div>

        {/* Center: Global quick search (visible on larger screens) */}
        <div className="hidden lg:flex items-center max-w-xs w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks anywhere..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Add task button, notifications bell, and profile avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Task button in header */}
          <button
            onClick={onAddTask}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-xs shadow-indigo-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>

          {/* Notifications menu */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {urgentTasks.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Urgent Notifications
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                      {urgentTasks.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {urgentTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        🎉 All caught up! No urgent tasks.
                      </p>
                    ) : (
                      urgentTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setShowNotifications(false);
                            onNavigate('all');
                          }}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            {isOverdue(t.dueDate, t.status) ? 'Overdue' : 'Due Today'}
                          </div>
                          <p className="text-xs font-medium text-slate-800 truncate mt-0.5">
                            {t.title}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-xs ring-2 ring-indigo-50">
              AM
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                Alex Morgan
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Product Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
