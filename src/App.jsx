import React, { useEffect, useState } from 'react'
import Taskform from './component/Taskform'
import Taskprogressbar from './component/Taskprogressbar'
import Tasklists from './component/Tasklists'
import Dashboard from './component/Dashboard'
import FilterSort from './component/FilterSort'
import SmartRecommendation from './component/SmartRecommendation'
import OverdueDetector from './component/OverdueDetector'
import CalendarView from './component/CalendarView'
import KanbanBoard from './component/KanbanBoard'
import PomodoroTimer from './component/PomodoroTimer'
import Analytics from './component/Analytics'
import TaskDetails from './component/TaskDetails'
import ImportExport from './component/ImportExport'
import Notifications from './component/Notifications'
import Settings from './component/Settings'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [view, setView] = useState("list");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      status: 'todo',
      createdAt: new Date().toISOString(),
      completed: false,
      subtasks: [],
      dependencies: [],
      history: [{ action: "created", timestamp: new Date().toISOString() }],
      timeSpent: 0,
      pomodorosCompleted: 0
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask, index) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...updatedTask,
      history: [
        ...newTasks[index].history,
        { action: "updated", timestamp: new Date().toISOString() }
      ]
    };
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const clearTasks = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      setTasks([]);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleImport = (importedTasks) => {
    setTasks([...tasks, ...importedTasks]);
  };

  const getTaskIndex = (taskId) => tasks.findIndex(t => t.id === taskId);

  const handleTaskUpdate = (updatedTask) => {
    const index = getTaskIndex(updatedTask.id);
    if (index !== -1) {
      updateTask(updatedTask, index);
      setSelectedTaskForDetail({ ...updatedTask });
    }
  };

  return (
    <div className={`app theme-${theme}`}>
      <Notifications tasks={tasks} />

      <header className="app-header">
        <div className="header-top">
          <h1>🚀 Taskora</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
        <p><i>Smart Task & Productivity Management Platform</i></p>
      </header>

      <nav className="view-nav">
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          📋 List
        </button>
        <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
          📊 Dashboard
        </button>
        <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}>
          📅 Calendar
        </button>
        <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>
          🎯 Kanban
        </button>
        <button className={view === "analytics" ? "active" : ""} onClick={() => setView("analytics")}>
          📈 Analytics
        </button>
        <button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}>
          ⚙️ Settings
        </button>
      </nav>

      <main className="app-main">
        {view === "list" && (
          <>
            <SmartRecommendation tasks={tasks} />
            <OverdueDetector tasks={tasks} />
            
            <Taskform addTask={addTask} />
            
            <FilterSort tasks={tasks} onFilteredTasksChange={setFilteredTasks} />
            
            <Tasklists 
              tasks={filteredTasks} 
              updateTask={(task, index) => {
                const actualIndex = getTaskIndex(filteredTasks[index].id);
                updateTask(task, actualIndex);
              }}
              deleteTask={(index) => {
                const actualIndex = getTaskIndex(filteredTasks[index].id);
                deleteTask(actualIndex);
              }}
              onTaskClick={(task) => setSelectedTaskForDetail(task)}
            />
            
            <Taskprogressbar tasks={tasks} />
            
            {tasks.length > 0 && (
              <button className='clear-btn' onClick={clearTasks}>Clear All Tasks</button>
            )}
          </>
        )}

        {view === "dashboard" && <Dashboard tasks={tasks} />}

        {view === "calendar" && <CalendarView tasks={tasks} />}

        {view === "kanban" && <KanbanBoard tasks={tasks} updateTask={updateTask} />}

        {view === "analytics" && (
          <div className='analytics-wrapper'>
            <PomodoroTimer />
            <Analytics tasks={tasks} />
          </div>
        )}

        {view === "settings" && (
          <>
            <ImportExport tasks={tasks} onImport={handleImport} />
            <Settings 
              theme={theme}
              onThemeChange={setTheme}
              onClearAll={clearTasks}
              onExportSettings={() => {
                const data = {
                  tasks,
                  theme,
                  exportDate: new Date().toISOString()
                };
                const dataStr = JSON.stringify(data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `taskora-backup-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
              }}
            />
          </>
        )}
      </main>

      {selectedTaskForDetail && (
        <TaskDetails 
          task={selectedTaskForDetail}
          tasks={tasks}
          onUpdate={handleTaskUpdate}
          onClose={() => setSelectedTaskForDetail(null)}
        />
      )}

      <footer className='app-footer'>
        <p>Made with ❤️ | Taskora v1.0</p>
      </footer>
    </div>
  )
}