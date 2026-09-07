import React, { useState } from 'react'

export default function KanbanBoard({ tasks, updateTask }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = {
    'todo': { title: 'To Do', color: '#6366f1' },
    'in-progress': { title: 'In Progress', color: '#f59e0b' },
    'review': { title: 'Review', color: '#8b5cf6' },
    'done': { title: 'Done', color: '#10b981' }
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'done';
    return task.status || 'todo';
  };

  const getColumnTasks = (columnId) => {
    return tasks.filter(task => getTaskStatus(task) === columnId);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTask = {
        ...draggedTask,
        status: columnId === 'done' ? draggedTask.status : columnId,
        completed: columnId === 'done'
      };
      const index = tasks.findIndex(t => t.id === draggedTask.id);
      updateTask(updatedTask, index);
      setDraggedTask(null);
    }
  };

  return (
    <div className='kanban-board'>
      {Object.entries(columns).map(([columnId, columnData]) => (
        <div key={columnId} className='kanban-column'>
          <div className='column-header' style={{ borderTopColor: columnData.color }}>
            <h3>{columnData.title}</h3>
            <span className='task-count'>{getColumnTasks(columnId).length}</span>
          </div>

          <div 
            className='column-content'
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId)}
          >
            {getColumnTasks(columnId).map(task => (
              <div 
                key={task.id}
                className='kanban-card'
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                <div className='card-header'>
                  <span className='card-priority' style={{
                    backgroundColor: task.priority === 'High' ? '#ef4444' :
                                     task.priority === 'Medium' ? '#f59e0b' : '#10b981'
                  }}>
                    {task.priority[0]}
                  </span>
                  <span className='card-category'>{task.category}</span>
                </div>
                <h4 className='card-title'>{task.text}</h4>
                {task.description && (
                  <p className='card-description'>{task.description.substring(0, 60)}...</p>
                )}
                <div className='card-footer'>
                  {task.estimatedTime > 0 && (
                    <span className='card-time'>⏱️ {task.estimatedTime}m</span>
                  )}
                  {task.dueDate && (
                    <span className='card-due'>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            {getColumnTasks(columnId).length === 0 && (
              <div className='empty-state'>Drop tasks here</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}