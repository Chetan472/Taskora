import React from 'react'

export default function TaskHistory({ task }) {
  return (
    <div className='task-history'>
      <h3>📜 Activity History</h3>
      
      {!task.history || task.history.length === 0 ? (
        <p className='no-history'>No activity recorded yet.</p>
      ) : (
        <ul className='history-list'>
          {task.history.map((entry, idx) => (
            <li key={idx} className='history-entry'>
              <span className='history-action'>
                {entry.action === 'created' && '✨ Created'}
                {entry.action === 'updated' && '✏️ Updated'}
                {entry.action === 'completed' && '✅ Completed'}
                {entry.action === 'uncompleted' && '↩️ Uncompleted'}
              </span>
              <span className='history-time'>
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}