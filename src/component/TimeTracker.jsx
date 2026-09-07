import React, { useState, useEffect } from 'react'

export default function TimeTracker({ task, onTimeUpdate }) {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(task?.timeSpent || 0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleSave = () => {
    setIsTracking(false);
    if (onTimeUpdate) {
      onTimeUpdate(elapsedTime);
    }
  };

  return (
    <div className='time-tracker'>
      <div className='tracker-display'>
        <span className='time-label'>Time Spent:</span>
        <span className='time-value'>{formatTime(elapsedTime)}</span>
      </div>

      <div className='tracker-session'>
        <span className='session-label'>This Session:</span>
        <span className='session-time'>{formatTime(sessionTime)}</span>
      </div>

      <div className='tracker-controls'>
        <button 
          onClick={() => setIsTracking(!isTracking)}
          className={`btn-track ${isTracking ? 'active' : ''}`}
        >
          {isTracking ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={handleSave} className='btn-track-save'>
          💾 Save
        </button>
      </div>

      {task && task.estimatedTime > 0 && (
        <div className='tracker-estimate'>
          <p>Estimated: {task.estimatedTime}m | Spent: {Math.floor(elapsedTime / 60)}m</p>
          <div className='estimate-bar'>
            <div style={{ width: `${(elapsedTime / (task.estimatedTime * 60)) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}