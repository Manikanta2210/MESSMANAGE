export const CATEGORIES = ['Personal', 'College', 'Work'];
export const PRIORITIES = ['High', 'Medium', 'Low'];

export const CATEGORY_CONFIG = {
  Personal: {
    label: 'Personal',
    color: 'emerald',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    accent: '#10b981',
  },
  College: {
    label: 'College',
    color: 'violet',
    badge: 'bg-violet-50 text-violet-700 border-violet-200/80',
    dot: 'bg-violet-500',
    accent: '#8b5cf6',
  },
  Work: {
    label: 'Work',
    color: 'blue',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    accent: '#3b82f6',
  },
};

export const PRIORITY_CONFIG = {
  High: {
    label: 'High',
    color: 'rose',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    border: 'border-l-rose-500',
    indicator: 'bg-rose-500',
    iconColor: 'text-rose-500',
    order: 3,
  },
  Medium: {
    label: 'Medium',
    color: 'amber',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    border: 'border-l-amber-500',
    indicator: 'bg-amber-500',
    iconColor: 'text-amber-500',
    order: 2,
  },
  Low: {
    label: 'Low',
    color: 'emerald',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    border: 'border-l-emerald-500',
    indicator: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
    order: 1,
  },
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'all', label: 'All Tasks', icon: 'CheckSquare' },
  { id: 'upcoming', label: 'Upcoming', icon: 'Calendar' },
  { id: 'completed', label: 'Completed', icon: 'CheckCircle2' },
];
