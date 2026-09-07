import React, { useMemo } from 'react'

export default function Analytics({ tasks }) {
  const analytics = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const completionByDay = last7Days.map(day => {
      const tasksCreatedOnDay = tasks.filter(t => t.createdAt?.startsWith(day)).length;
      const tasksCompletedOnDay = tasks.filter(t => 
        t.completed && 
        t.history?.some(h => h.timestamp?.startsWith(day) && h.action === 'updated')
      ).length;
      return { date: day, created: tasksCreatedOnDay, completed: tasksCompletedOnDay };
    });

    const categories = [...new Set(tasks.map(t => t.category))];
    const categoryProductivity = categories.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      const completed = catTasks.filter(t => t.completed).length;
      const rate = catTasks.length > 0 ? (completed / catTasks.length) * 100 : 0;
      return { name: cat, total: catTasks.length, completed, rate };
    });

    const totalTimeEstimated = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    const totalTimeSpent = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
    const avgTaskTime = tasks.length > 0 ? Math.round(totalTimeEstimated / tasks.length) : 0;

    const priorityStats = {
      'High': {
        total: tasks.filter(t => t.priority === 'High').length,
        completed: tasks.filter(t => t.priority === 'High' && t.completed).length
      },
      'Medium': {
        total: tasks.filter(t => t.priority === 'Medium').length,
        completed: tasks.filter(t => t.priority === 'Medium' && t.completed).length
      },
      'Low': {
        total: tasks.filter(t => t.priority === 'Low').length,
        completed: tasks.filter(t => t.priority === 'Low' && t.completed).length
      }
    };

    return {
      completionByDay,
      categoryProductivity,
      totalTimeEstimated,
      totalTimeSpent,
      avgTaskTime,
      priorityStats
    };
  }, [tasks]);

  const hours = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className='analytics-container'>
      <div className='analytics-section'>
        <h3>📊 Time Investment</h3>
        <div className='time-stats'>
          <div className='time-stat'>
            <p className='stat-label'>Total Estimated</p>
            <p className='stat-value'>{hours(analytics.totalTimeEstimated)}</p>
          </div>
          <div className='time-stat'>
            <p className='stat-label'>Total Spent</p>
            <p className='stat-value'>{hours(analytics.totalTimeSpent)}</p>
          </div>
          <div className='time-stat'>
            <p className='stat-label'>Avg. Per Task</p>
            <p className='stat-value'>{analytics.avgTaskTime}m</p>
          </div>
        </div>
      </div>

      <div className='analytics-section'>
        <h3>🎯 Category Productivity</h3>
        <div className='category-analytics'>
          {analytics.categoryProductivity.map((cat, idx) => (
            <div key={idx} className='cat-analytics-item'>
              <div className='cat-header'>
                <span className='cat-name'>{cat.name}</span>
                <span className='cat-rate'>{cat.rate.toFixed(0)}%</span>
              </div>
              <div className='cat-progress-bar'>
                <div style={{ width: `${cat.rate}%` }}></div>
              </div>
              <p className='cat-count'>{cat.completed}/{cat.total} completed</p>
            </div>
          ))}
        </div>
      </div>

      <div className='analytics-section'>
        <h3>⚡ Priority Completion Rate</h3>
        <div className='priority-analytics'>
          {Object.entries(analytics.priorityStats).map(([priority, stats]) => (
            <div key={priority} className='priority-stat'>
              <span className='priority-name'>{priority} Priority</span>
              <div className='priority-bar'>
                <div 
                  className='priority-fill'
                  style={{ 
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                    backgroundColor: priority === 'High' ? '#ef4444' : 
                                     priority === 'Medium' ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
              <span className='priority-count'>{stats.completed}/{stats.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='analytics-section'>
        <h3>📈 Completion Trend (Last 7 Days)</h3>
        <div className='trend-chart'>
          {analytics.completionByDay.map((day, idx) => (
            <div key={idx} className='trend-item'>
              <span className='trend-date'>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <div className='trend-bars'>
                <div className='bar created' title={`Created: ${day.created}`} style={{ height: `${day.created * 20}px` }}></div>
                <div className='bar completed' title={`Completed: ${day.completed}`} style={{ height: `${day.completed * 20}px` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className='trend-legend'>
          <div><span className='legend-bar created'></span>Created</div>
          <div><span className='legend-bar completed'></span>Completed</div>
        </div>
      </div>
    </div>
  );
}