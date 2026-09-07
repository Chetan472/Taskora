import React, { useState } from 'react'

export default function Tasklists({ tasks, updateTask, deleteTask, onTaskClick }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleComplete = (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    updateTask(updatedTask, index);
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <ul className='task-list'>
      {tasks.map((task, index) => (
        <li key={task.id || index} className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`}>
          <div className='task-header'>
            <div className='task-main'>
              <span className='priority-dot' style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
              <span className={`task-text ${task.completed ? 'strike' : ''}`}>{task.text}</span>
              <small>({task.priority}, {task.category})</small>
              {isOverdue(task) && <span className='overdue-badge'>Overdue</span>}
            </div>

            <div className='task-actions'>
              <button onClick={() => toggleComplete(index)} className='btn-complete'>
                {task.completed ? "✓ Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(index)} className='btn-delete'>Delete</button>
              <button onClick={() => {
                setExpandedId(expandedId === task.id ? null : task.id);
                if (onTaskClick) onTaskClick(task);
              }} className='btn-expand'>
                {expandedId === task.id ? '▼' : '▶'}
              </button>
            </div>
          </div>

          {expandedId === task.id && (
            <div className='task-details'>
              {task.description && (
                <p><strong>Description:</strong> {task.description}</p>
              )}
              {task.dueDate && (
                <p><strong>Due:</strong> {formatDate(task.dueDate)} {task.dueTime && `at ${task.dueTime}`}</p>
              )}
              {task.estimatedTime > 0 && (
                <p><strong>Estimated Time:</strong> {task.estimatedTime} minutes</p>
              )}
              {task.recurring !== 'none' && (
                <p><strong>Recurring:</strong> {task.recurring}</p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}