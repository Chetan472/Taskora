import React, { useState } from 'react'

export default function Taskform({ addTask }) {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [recurring, setRecurring] = useState('none'); // "daily", "weekly", "monthly", "none"
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) return;

    addTask({
      text: task,
      description,
      priority,
      category,
      dueDate,
      dueTime,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : 0, // in minutes
      recurring,
      completed: false,
    });

    // Reset form
    setTask('');
    setDescription('');
    setPriority('Medium');
    setCategory('General');
    setDueDate('');
    setDueTime('');
    setEstimatedTime('');
    setRecurring('none');
  };

  return (
    <form onSubmit={handleSubmit} className='task-form'>
      <div id='input'>
        <input
          type="text"
          placeholder='Enter a Task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <button type='submit'>Add Task</button>
      </div>

      <div id='btns'>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Due Date"
        />

        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      <button
        type='button'
        className='toggle-advanced'
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼ Hide' : '▶ Advanced'}
      </button>

      {showAdvanced && (
        <div className='advanced-options'>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Task description...'
            />
          </div>

          <div>
            <label>Estimated Time (minutes)</label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder='0'
              min='0'
            />
          </div>

          <div>
            <label>Recurring</label>
            <select value={recurring} onChange={(e) => setRecurring(e.target.value)}>
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      )}
    </form>
  )
}