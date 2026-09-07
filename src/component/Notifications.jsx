import React, { useState, useEffect } from 'react'

export default function Notifications({ tasks }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkNotifications = () => {
      const newNotifications = [];
      const now = new Date();

      tasks.forEach(task => {
        if (task.completed) return;

        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          if (dueDate < now) {
            newNotifications.push({
              id: `overdue-${task.id}`,
              type: 'overdue',
              title: 'Overdue Task',
              message: `"${task.text}" is overdue`,
              task
            });
          }
        }

        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
          if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
            newNotifications.push({
              id: `due-soon-${task.id}`,
              type: 'due-soon',
              title: 'Due Soon',
              message: `"${task.text}" is due in ${Math.round(hoursUntilDue)}h`,
              task
            });
          }
        }
      });

      setNotifications(newNotifications);
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className='notifications-container'>
      {notifications.map(notif => (
        <div key={notif.id} className={`notification ${notif.type}`}>
          <div className='notification-content'>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(notif.id)}
            className='btn-dismiss'
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}