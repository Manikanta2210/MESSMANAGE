import { getDateStringOffset } from './dateUtils';

const STORAGE_KEY = 'taskflow_tasks_v1';
const INITIALIZED_KEY = 'taskflow_initialized_v1';

export function getInitialSampleTasks() {
  return [
    {
      id: 'task-1',
      title: 'Finalize quarterly product roadmap',
      description: 'Review OKRs with engineering leadership and draft executive summary deck for stakeholders.',
      priority: 'High',
      category: 'Work',
      dueDate: getDateStringOffset(1), // Tomorrow
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Submit Distributed Systems lab assignment',
      description: 'Implement Raft consensus algorithm leader election test cases and submit PDF report.',
      priority: 'High',
      category: 'College',
      dueDate: getDateStringOffset(0), // Due Today
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Weekly 5k endurance run & stretching',
      description: 'Maintain cardio routine at city park track, followed by 15-minute foam roll recovery.',
      priority: 'Medium',
      category: 'Personal',
      dueDate: getDateStringOffset(2), // In 2 days
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Prepare slides for Machine Learning seminar',
      description: 'Cover transformer attention mechanisms, multi-head attention visualizations, and benchmark figures.',
      priority: 'Medium',
      category: 'College',
      dueDate: getDateStringOffset(4), // In 4 days
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'task-5',
      title: 'Conduct frontend code review for v2.4 release',
      description: 'Audit Tailwind class consistency, responsive layouts, and accessibility tags in PR #142.',
      priority: 'Low',
      category: 'Work',
      dueDate: getDateStringOffset(5), // In 5 days
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    {
      id: 'task-6',
      title: 'Renew annual vehicle insurance policy',
      description: 'Compare comprehensive coverage quotes from top providers and verify zero-depreciation add-on.',
      priority: 'High',
      category: 'Personal',
      dueDate: getDateStringOffset(-1), // Overdue by 1 day
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    },
    {
      id: 'task-7',
      title: 'Schedule dentist checkup & dental cleaning',
      description: 'Book morning appointment slot with Dr. Harrison for routine six-month checkup.',
      priority: 'Low',
      category: 'Personal',
      dueDate: getDateStringOffset(-3), // Past
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    },
  ];
}

export function loadTasksFromStorage() {
  try {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!isInitialized || !savedData) {
      // First visit: initialize with sample tasks
      const sampleTasks = getInitialSampleTasks();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return sampleTasks;
    }

    const parsed = JSON.parse(savedData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return getInitialSampleTasks();
  }
}

export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function resetToSampleTasks() {
  const samples = getInitialSampleTasks();
  saveTasksToStorage(samples);
  localStorage.setItem(INITIALIZED_KEY, 'true');
  return samples;
}
