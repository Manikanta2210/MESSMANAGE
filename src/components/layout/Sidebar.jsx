import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CheckCircle2,
  Plus,
  Sparkles,
  Folder,
  RotateCcw,
  X,
  Layers,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../utils/constants';

export default function Sidebar({
  currentView,
  onNavigate,
  tasks,
  onAddTask,
  onResetData,
  mobileOpen,
  onCloseMobile,
}) {
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingCount = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate >= todayStr
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: CheckSquare,
      badge: tasks.length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      badge: upcomingCount > 0 ? upcomingCount : null,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      badge: completedCount > 0 ? completedCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 px-4 py-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Task<span className="text-indigo-600">Flow</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Workspace & Tracker
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Action: Add Task Button */}
      <div className="px-1 mb-5">
        <button
          onClick={() => {
            onAddTask();
            if (mobileOpen) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <p className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (mobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div>
          <p className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Categories
          </p>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const conf = CATEGORY_CONFIG[cat];
              const count = tasks.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onNavigate('all', { category: cat });
                    if (mobileOpen) onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${conf.dot}`} />
                    <span>{cat}</span>
                  </div>
                  <span className="text-xs text-slate-400">{count}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Utilities */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          title="Reload initial sample data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Tasks</span>
        </button>

        <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[11px] font-semibold text-slate-600">Storage Mode</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Local Browser Storage (Persistent)
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed width) */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
