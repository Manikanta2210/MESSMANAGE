# ⚡ TaskFlow — Modern Productivity & Task Manager

**TaskFlow** is a modern, frontend-only productivity dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**. It delivers a clean, responsive SaaS dashboard experience with persistent browser `LocalStorage`, instant search, multi-faceted filtering, categorized workflows, urgency tracking, and statistical analytics.

---

## 🚀 Live Highlights & Features

### 1. 📊 Executive Dashboard
- **Key Metrics Overview**: Real-time counter cards for **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks**.
- **Visual Productivity Score**: Animated progress bar calculating dynamic completion percentage.
- **Analytics Distribution**: Segmented breakdown of tasks across **Categories** (`Personal`, `College`, `Work`) and **Priority Levels** (`High`, `Medium`, `Low`).
- **Recently Created Feed**: Rapid-access list of newly logged tasks with one-click status toggling.
- **Upcoming Deadlines Radar**: Chronologically sorted pending tasks with urgency badges (*Overdue*, *Due Today*, *Due Tomorrow*).

### 2. 📝 Comprehensive Task Management (CRUD)
- **Create Tasks**: Intuitive modal with title validation, multi-line notes, priority selector, category tagger, and due date picker.
- **Edit Tasks**: Update descriptions, reschedule deadlines, or re-prioritize existing tasks at any time.
- **Delete Tasks**: Protected with an interactive danger confirmation modal to prevent accidental data loss.
- **Status Toggle**: One-click checkmark toggle between Pending and Completed with celebratory toast notifications.
- **Data Model**:
  - `id` (Unique identifier)
  - `title` (Task title)
  - `description` (Detailed notes / links)
  - `priority` (`High` | `Medium` | `Low`)
  - `category` (`Personal` | `College` | `Work`)
  - `dueDate` (Date format `YYYY-MM-DD`)
  - `status` (`pending` | `completed`)
  - `createdAt` & `updatedAt` (ISO timestamps)

### 3. 🔍 Smart Filters & Search
- **Full-Text Search**: Live filtering matching both task titles and descriptions.
- **Status Filters**: Quick switch between *All Tasks*, *Pending*, *Completed*, and *High Priority*.
- **Category Filter Pills**: Isolate tasks by *Personal*, *College*, or *Work*.
- **Sorting Options**:
  - Due Date (Earliest / Latest)
  - Priority (High to Low)
  - Recently Added
  - Alphabetical (A - Z)
- **View Toggle**: Switch between **Grid View** and compact **List View**.

### 4. 💾 Zero-Backend Browser Storage
- Tasks are automatically synced to browser `localStorage` (`taskflow_tasks_v1`).
- Persists across page reloads, browser restarts, and device sessions without any external database or API dependency.
- Populated with realistic sample data on first visit without overwriting user changes.
- Built-in **"Reset Sample Tasks"** utility with confirmation dialog.

### 5. 📱 Responsive SaaS Design
- Desktop sidebar navigation with active badge counts.
- Mobile drawer navigation accessible via hamburger menu on smaller viewports.
- Responsive grid layouts with zero horizontal scroll overflow.
- Clean light theme palette with refined indigo/purple accents, subtle borders, and smooth micro-interactions.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **React 19** | Component-driven UI library |
| **Vite 8** | Ultra-fast build tool & development server |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **Lucide React** | Consistent, modern vector iconography |
| **LocalStorage API** | Client-side persistent data storage |

---

## 📂 Project Directory Structure

```
task-manager/
├── amplify.yml                # AWS Amplify hosting configuration
├── index.html                 # HTML entry with Plus Jakarta Sans typography
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration with relative asset paths
├── src/
│   ├── main.jsx               # React DOM root entry point
│   ├── App.jsx                # Core application controller & views
│   ├── index.css              # Tailwind base imports & custom styles
│   ├── utils/
│   │   ├── constants.js       # Categories, priorities, badge colors
│   │   ├── dateUtils.js       # Overdue calculation & relative date formatters
│   │   └── storage.js         # LocalStorage persistence & sample data
│   └── components/
│       ├── common/
│       │   ├── ConfirmModal.jsx # Deletion & reset confirmation dialogs
│       │   ├── EmptyState.jsx   # Friendly empty state placeholders
│       │   └── Toast.jsx        # Animated feedback toast notifications
│       ├── layout/
│       │   ├── Header.jsx       # Header bar, search, notifications, profile
│       │   └── Sidebar.jsx      # Desktop navigation & mobile drawer
│       ├── dashboard/
│       │   ├── StatsOverview.jsx      # Top 4 statistics & progress banner
│       │   ├── AnalyticsCards.jsx     # Category & priority distribution
│       │   ├── RecentTasks.jsx        # Recent tasks quick widget
│       │   └── UpcomingDeadlines.jsx  # Approaching deadlines widget
│       └── tasks/
│           ├── TaskCard.jsx       # Individual task card with badge tags
│           ├── TaskFilterBar.jsx  # Search, filters, sort, and layout toggle
│           ├── TaskList.jsx       # Responsive grid/list container
│           └── TaskModal.jsx      # Add / Edit task modal dialog
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Clone or Open the Repository
```bash
cd task-manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🐙 Step-by-Step GitHub Upload Guide

Follow these steps to upload TaskFlow to your GitHub account:

### Step 1: Initialize Git Repository
In the root of the project directory (`task-manager`), run:
```bash
git init
```

### Step 2: Stage All Files
```bash
git add .
```

### Step 3: Commit the Project
```bash
git commit -m "feat: initial TaskFlow modern frontend application"
```

### Step 4: Create a New GitHub Repository
1. Log into your account on [GitHub](https://github.com/).
2. Click the **+** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `taskflow` or `task-manager`).
4. Set visibility to **Public** (or **Private**).
5. **Do not** check "Initialize this repository with a README" (we already have one).
6. Click **Create repository**.

### Step 5: Link and Push to GitHub
Copy the commands shown on your new GitHub repository page:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## ☁️ Step-by-Step AWS Amplify Deployment Guide

Because **TaskFlow** is 100% frontend-only with relative asset paths configured in Vite (`base: './'`), it deploys to **AWS Amplify Hosting** in just minutes with zero server configuration.

### Method 1: Deploy via AWS Amplify Console (Recommended)

1. **Log in to AWS**:
   - Go to the [AWS Management Console](https://console.aws.amazon.com/).
   - Search for **AWS Amplify** in the top search bar and open the service.

2. **Create New App**:
   - Click **Deploy an app** or **Create new app**.
   - Select **GitHub** as the source code provider and click **Next**.
   - Authorize AWS Amplify to access your GitHub repositories.

3. **Select Repository & Branch**:
   - Choose your repository (`taskflow` or `task-manager`).
   - Select the branch: `main`.
   - Click **Next**.

4. **Configure Build Settings**:
   - Amplify automatically detects the included [`amplify.yml`](./amplify.yml) file.
   - Verify the build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Make sure **Base directory** is set to `dist`.
   - Click **Next**.

5. **Review and Deploy**:
   - Click **Save and deploy**.
   - AWS Amplify will automatically provision an environment, build the Vite frontend, and deploy it to a global CDN.
   - When completed, click your generated domain (e.g. `https://main.d1234567abcdef.amplifyapp.com`) to view TaskFlow live!

6. **Single Page Application (SPA) Rewrites (Optional / Recommended)**:
   - In the Amplify console, navigate to **Hosting** > **Rewrites and redirects**.
   - Ensure the default SPA rewrite exists so all routes redirect to `index.html`:
     - **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
     - **Target address**: `/index.html`
     - **Type**: `200 (Rewrite)`

---

## 🔒 Security & Privacy Notice
TaskFlow runs entirely inside the client browser. No user data, task titles, or descriptions are ever transmitted to any external server or third-party service. All storage stays safely in your local browser storage.
