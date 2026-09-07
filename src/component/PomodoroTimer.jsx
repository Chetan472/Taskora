import React, { useState, useEffect } from 'react'

export default function PomodoroTimer({ task, onTaskUpdate }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(task?.pomodorosCompleted || 0);
  const [mode, setMode] = useState('work');

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (mode === 'work') {
        setSessionsCompleted(sessionsCompleted + 1);
        if (onTaskUpdate) {
          onTaskUpdate({ pomodorosCompleted: sessionsCompleted + 1 });
        }
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionsCompleted, onTaskUpdate]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className='pomodoro-timer'>
      <div className={`timer-display ${mode}`}>
        <div className='timer-mode'>{mode === 'work' ? '🔴 Work' : '🟢 Break'}</div>
        <div className='timer-time'>{formatTime(timeLeft)}</div>
        <div className='timer-progress'>
          <div className='progress-bar' style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className='timer-controls'>
        <button 
          onClick={toggleTimer}
          className={`btn-timer ${isActive ? 'active' : ''}`}
        >
          {isActive ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={resetTimer} className='btn-timer-reset'>
          🔄 Reset
        </button>
      </div>

      <div className='timer-stats'>
        <div className='stat'>
          <span className='stat-label'>Sessions Today</span>
          <span className='stat-value'>{sessionsCompleted}</span>
        </div>
        <div className='stat'>
          <span className='stat-label'>Productivity Streak</span>
          <span className='stat-value'>🔥 {Math.floor(sessionsCompleted / 4)}</span>
        </div>
      </div>

      {task && (
        <div className='timer-task-info'>
          <p><strong>Current Task:</strong> {task.text}</p>
          <p><strong>Estimated:</strong> {task.estimatedTime} minutes</p>
        </div>
      )}
    </div>
  );
}