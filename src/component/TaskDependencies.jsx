import React, { useState } from 'react'

export default function TaskDependencies({ tasks, task, onAddDependency, onRemoveDependency }) {
  const [showDependencyModal, setShowDependencyModal] = useState(false);

  const availableTasks = tasks.filter(t => 
    t.id !== task.id && 
    !task.dependencies.includes(t.id)
  );

  const blockedBy = tasks.filter(t => t.dependencies.includes(task.id));

  const canComplete = task.dependencies.every(depId => {
    const depTask = tasks.find(t => t.id === depId);
    return depTask && depTask.completed;
  });

  return (
    <div className='task-dependencies'>
      {task.dependencies.length > 0 && (
        <div className='dependencies-section'>
          <h4>⛓️ Dependencies ({task.dependencies.length})</h4>
          <ul className='dependencies-list'>
            {task.dependencies.map(depId => {
              const depTask = tasks.find(t => t.id === depId);
              return depTask ? (
                <li key={depId} className={`dependency-item ${depTask.completed ? 'completed' : 'pending'}`}>
                  <span className='dep-status'>
                    {depTask.completed ? '✓' : '○'}
                  </span>
                  <span className='dep-text'>{depTask.text}</span>
                  <button 
                    onClick={() => onRemoveDependency(depId)}
                    className='btn-remove-dep'
                    title='Remove dependency'
                  >
                    ×
                  </button>
                </li>
              ) : null;
            })}
          </ul>
          {!canComplete && (
            <p className='warning-text'>⚠️ Complete all dependencies to mark this task done</p>
          )}
        </div>
      )}

      {blockedBy.length > 0 && (
        <div className='blocked-by-section'>
          <h4>🚫 Blocked By ({blockedBy.length})</h4>
          <ul className='blocked-list'>
            {blockedBy.map(t => (
              <li key={t.id}>{t.text}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={() => setShowDependencyModal(true)}
        className='btn-add-dep'
      >
        + Add Dependency
      </button>

      {showDependencyModal && (
        <div className='modal-overlay' onClick={() => setShowDependencyModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <h3>Add Dependency</h3>
            <p>Select a task that must be completed before this one:</p>
            <ul className='dependency-selection'>
              {availableTasks.map(t => (
                <li key={t.id}>
                  <button 
                    onClick={() => {
                      onAddDependency(t.id);
                      setShowDependencyModal(false);
                    }}
                    className='dep-select-btn'
                  >
                    {t.text}
                  </button>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowDependencyModal(false)}
              className='btn-close-modal'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}