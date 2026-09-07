import React, { useState } from 'react'
import TimeTracker from './TimeTracker'
import TaskDependencies from './TaskDependencies'

export default function TaskDetails({ task, tasks, onUpdate, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setEditMode(false);
  };

  const handleTimeUpdate = (timeSpent) => {
    onUpdate({ ...editedTask, timeSpent });
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className='task-details-modal'>
      <div className='modal-overlay' onClick={onClose}></div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>{editMode ? 'Edit Task' : 'Task Details'}</h2>
          <button onClick={onClose} className='btn-close'>×</button>
        </div>

        <div className='modal-body'>
          {!editMode ? (
            <>
              <div className='detail-section'>
                <h3 className={isOverdue ? 'overdue-title' : ''}>{task.text}</h3>
                {isOverdue && <span className='overdue-alert'>⏰ Overdue</span>}
              </div>

              {task.description && (
                <div className='detail-section'>
                  <h4>Description</h4>
                  <p>{task.description}</p>
                </div>
              )}

              <div className='detail-grid'>
                <div className='detail-item'>
                  <span className='detail-label'>Priority</span>
                  <span className='detail-value'>{task.priority}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Category</span>
                  <span className='detail-value'>{task.category}</span>
                </div>
                {task.dueDate && (
                  <div className='detail-item'>
                    <span className='detail-label'>Due Date</span>
                    <span className='detail-value'>{new Date(task.dueDate).toLocaleDateString()} {task.dueTime && `at ${task.dueTime}`}</span>
                  </div>
                )}
                {task.estimatedTime > 0 && (
                  <div className='detail-item'>
                    <span className='detail-label'>Estimated Time</span>
                    <span className='detail-value'>{task.estimatedTime} minutes</span>
                  </div>
                )}
                <div className='detail-item'>
                  <span className='detail-label'>Time Spent</span>
                  <span className='detail-value'>{Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m</span>
                </div>
                {task.recurring !== 'none' && (
                  <div className='detail-item'>
                    <span className='detail-label'>Recurring</span>
                    <span className='detail-value'>{task.recurring}</span>
                  </div>
                )}
              </div>

              <div className='detail-section'>
                <TimeTracker task={task} onTimeUpdate={handleTimeUpdate} />
              </div>

              {task.dependencies && task.dependencies.length > 0 && (
                <div className='detail-section'>
                  <TaskDependencies 
                    tasks={tasks}
                    task={task}
                    onAddDependency={(depId) => {
                      onUpdate({ ...editedTask, dependencies: [...task.dependencies, depId] });
                    }}
                    onRemoveDependency={(depId) => {
                      onUpdate({ ...editedTask, dependencies: task.dependencies.filter(id => id !== depId) });
                    }}
                  />
                </div>
              )}

              <div className='detail-section'>
                <h4>Created</h4>
                <p>{new Date(task.createdAt).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <div className='form-group'>
                <label>Task Name</label>
                <input
                  type="text"
                  value={editedTask.text}
                  onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
                />
              </div>

              <div className='form-group'>
                <label>Description</label>
                <textarea
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Priority</label>
                  <select 
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Category</label>
                  <select 
                    value={editedTask.category}
                    onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                  >
                    <option>General</option>
                    <option>Personal</option>
                    <option>Work</option>
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editedTask.dueDate || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  />
                </div>

                <div className='form-group'>
                  <label>Due Time</label>
                  <input
                    type="time"
                    value={editedTask.dueTime || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, dueTime: e.target.value })}
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={editedTask.estimatedTime || 0}
                  onChange={(e) => setEditedTask({ ...editedTask, estimatedTime: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
            </>
          )}
        </div>

        <div className='modal-footer'>
          {editMode && (
            <button onClick={handleSave} className='btn-save'>Save Changes</button>
          )}
          <button onClick={() => setEditMode(!editMode)} className='btn-edit'>
            {editMode ? 'Cancel' : 'Edit Task'}
          </button>
          <button onClick={onClose} className='btn-close-modal'>Close</button>
        </div>
      </div>
    </div>
  );
}