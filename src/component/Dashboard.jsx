import React from 'react'

export default function Dashboard({ tasks }) {
  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // By priority
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.completed).length;
  const mediumPriority = tasks.filter(t => t.priority === 'Medium' && !t.completed).length;
  const lowPriority = tasks.filter(t => t.priority === 'Low' && !t.completed).length;

  // By category
  const categories = [...new Set(tasks.map(t => t.category))];
  const categoryStats = categories.map(cat => ({
    name: cat,
    total: tasks.filter(t => t.category === cat).length,
    completed: tasks.filter(t => t.category === cat && t.completed).length
  }));

  // Overdue tasks
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Average estimated time
  const tasksWithEstimate = tasks.filter(t => t.estimatedTime > 0);
  const avgEstimate = tasksWithEstimate.length > 0 
    ? Math.round(tasksWithEstimate.reduce((sum, t) => sum + t.estimatedTime, 0) / tasksWithEstimate.length)
    : 0;

  // Smart Task Score
  const calculateScore = () => {
    if (totalTasks === 0) return 0;
    
    let score = completionRate * 0.5; // 50% based on completion
    
    // Bonus for consistent work
    if (activeTasks > 0) score += Math.min(20, activeTasks * 2);
    
    // Penalty for overdue
    if (overdueTasks > 0) score = Math.max(0, score - overdueTasks * 5);
    
    return Math.round(score);
  };

  const score = calculateScore();

  return (
    <div className='dashboard'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <h3>Total Tasks</h3>
          <p className='stat-number'>{totalTasks}</p>
        </div>

        <div className='stat-card'>
          <h3>Completed</h3>
          <p className='stat-number'>{completedTasks}</p>
          <small>{completionRate}%</small>
        </div>

        <div className='stat-card'>
          <h3>Active</h3>
          <p className='stat-number'>{activeTasks}</p>
        </div>

        <div className='stat-card'>
          <h3>Overdue</h3>
          <p className='stat-number' style={{ color: overdueTasks > 0 ? '#ef4444' : '#10b981' }}>
            {overdueTasks}
          </p>
        </div>

        <div className='stat-card'>
          <h3>Productivity Score</h3>
          <p className='stat-number' style={{ color: score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444' }}>
            {score}
          </p>
        </div>

        <div className='stat-card'>
          <h3>Avg. Est. Time</h3>
          <p className='stat-number'>{avgEstimate}m</p>
        </div>
      </div>

      <div className='stats-section'>
        <h3>Priority Distribution</h3>
        <div className='priority-stats'>
          <div className='priority-item'>
            <span>🔴 High</span>
            <div className='bar' style={{ width: `${highPriority * 20}%`, backgroundColor: '#ef4444' }}></div>
            <span>{highPriority}</span>
          </div>
          <div className='priority-item'>
            <span>🟡 Medium</span>
            <div className='bar' style={{ width: `${mediumPriority * 20}%`, backgroundColor: '#f59e0b' }}></div>
            <span>{mediumPriority}</span>
          </div>
          <div className='priority-item'>
            <span>🟢 Low</span>
            <div className='bar' style={{ width: `${lowPriority * 20}%`, backgroundColor: '#10b981' }}></div>
            <span>{lowPriority}</span>
          </div>
        </div>
      </div>

      <div className='stats-section'>
        <h3>By Category</h3>
        <div className='category-stats'>
          {categoryStats.map((cat, idx) => (
            <div key={idx} className='category-item'>
              <span>{cat.name}</span>
              <div className='mini-progress'>
                <div style={{ width: `${(cat.completed / cat.total) * 100}%` }}></div>
              </div>
              <small>{cat.completed}/{cat.total}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}