import React, { useMemo } from 'react'

export default function OverdueDetector({ tasks }) {
  const overdueStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });

    const dueTodayTasks = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });

    const daysOverdue = overdue.map(t => {
      const dueDate = new Date(t.dueDate);
      const days = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      return { task: t, daysOverdue: days };
    }).sort((a, b) => b.daysOverdue - a.daysOverdue);

    return {
      overdue,
      dueTodayTasks,
      daysOverdue,
      totalOverdued: overdue.length
    };
  }, [tasks]);

  if (overdueStats.overdue.length === 0 && overdueStats.dueTodayTasks.length === 0) {
    return (
      <div className='overdue-detector empty'>
        <p>✅ No overdue tasks! You're on track.</p>
      </div>
    );
  }

  return (
    <div className='overdue-detector'>
      {overdueStats.overdue.length > 0 && (
        <div className='overdue-section critical'>
          <h3>⚠️ {overdueStats.overdue.length} Overdue Task{overdueStats.overdue.length !== 1 ? 's' : ''}</h3>
          <ul className='overdue-list'>
            {overdueStats.daysOverdue.map((item, idx) => (
              <li key={idx} className='overdue-item'>
                <div className='overdue-info'>
                  <span className='overdue-name'>{item.task.text}</span>
                  <span className='overdue-days'>{item.daysOverdue} day{item.daysOverdue !== 1 ? 's' : ''} overdue</span>
                </div>
                <span className='priority-badge' style={{
                  backgroundColor: item.task.priority === 'High' ? '#ef4444' : 
                                   item.task.priority === 'Medium' ? '#f59e0b' : '#10b981'
                }}>
                  {item.task.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {overdueStats.dueTodayTasks.length > 0 && (
        <div className='overdue-section warning'>
          <h3>📅 {overdueStats.dueTodayTasks.length} Due Today</h3>
          <ul className='overdue-list'>
            {overdueStats.dueTodayTasks.map((task, idx) => (
              <li key={idx} className='overdue-item'>
                <span className='overdue-name'>{task.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}