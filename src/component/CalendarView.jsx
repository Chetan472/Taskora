import React, { useState, useMemo } from 'react'

export default function CalendarView({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const tasksOnDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(task);
      }
    });
    return map;
  }, [tasks]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const days = daysInMonth(currentMonth);
  const firstDay = firstDayOfMonth(currentMonth);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= days; i++) {
    calendarDays.push(i);
  }

  return (
    <div className='calendar-view'>
      <div className='calendar-header'>
        <button onClick={handlePrevMonth} className='btn-nav'>←</button>
        <h2>{monthName}</h2>
        <button onClick={handleNextMonth} className='btn-nav'>→</button>
      </div>

      <div className='calendar-weekdays'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className='weekday'>{day}</div>
        ))}
      </div>

      <div className='calendar-days'>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className='day empty'></div>;
          }

          const dateStr = new Date(year, month, day).toISOString().split('T')[0];
          const dayTasks = tasksOnDate[dateStr] || [];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div key={day} className={`day ${isToday ? 'today' : ''}`}>
              <div className='day-number'>{day}</div>
              <div className='day-tasks'>
                {dayTasks.slice(0, 2).map((t, idx) => (
                  <div key={idx} className={`task-dot ${t.completed ? 'completed' : 'pending'}`} title={t.text}>
                    ●
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className='task-overflow'>+{dayTasks.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className='calendar-legend'>
        <div className='legend-item'>
          <span className='dot pending'>●</span> Pending
        </div>
        <div className='legend-item'>
          <span className='dot completed'>●</span> Completed
        </div>
      </div>
    </div>
  );
}