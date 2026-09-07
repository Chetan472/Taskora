import React, { useMemo } from 'react'

export default function SmartRecommendation({ tasks }) {
  const recommendation = useMemo(() => {
    const activeTasks = tasks.filter(t => !t.completed);
    
    if (activeTasks.length === 0) {
      return {
        message: '🎉 All caught up! Great job!',
        task: null,
        reason: 'no_tasks'
      };
    }

    // Calculate urgency score for each task
    const scoredTasks = activeTasks.map(task => {
      let score = 0;
      
      // Priority weight
      const priorityWeight = { 'High': 30, 'Medium': 20, 'Low': 10 };
      score += priorityWeight[task.priority] || 0;

      // Overdue penalty
      if (task.dueDate) {
        const daysUntilDue = (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilDue < 0) {
          score += 50; // Overdue tasks get high priority
        } else if (daysUntilDue < 1) {
          score += 30; // Due today
        } else if (daysUntilDue < 3) {
          score += 20; // Due soon
        }
      }

      // Estimated time (prefer shorter tasks when busy)
      const avgTime = activeTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0) / activeTasks.length;
      if (task.estimatedTime && task.estimatedTime < avgTime) {
        score += 5;
      }

      return { task, score };
    });

    // Get top recommendation
    const topTask = scoredTasks.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    const daysUntilDue = topTask.task.dueDate 
      ? (new Date(topTask.task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
      : null;

    let reason = 'high_priority';
    let message = `🎯 Focus on this task (${topTask.task.priority} priority)`;

    if (daysUntilDue !== null && daysUntilDue < 0) {
      reason = 'overdue';
      message = '⏰ This task is overdue! Complete it ASAP';
    } else if (daysUntilDue !== null && daysUntilDue < 1) {
      reason = 'due_today';
      message = '📅 This task is due today';
    }

    return { message, task: topTask.task, reason };
  }, [tasks]);

  if (!recommendation.task) {
    return (
      <div className='smart-recommendation empty'>
        <p>{recommendation.message}</p>
      </div>
    );
  }

  return (
    <div className={`smart-recommendation ${recommendation.reason}`}>
      <div className='recommendation-header'>
        <p className='recommendation-message'>{recommendation.message}</p>
      </div>
      <div className='recommendation-task'>
        <h4>{recommendation.task.text}</h4>
        {recommendation.task.description && (
          <p>{recommendation.task.description}</p>
        )}
        <div className='recommendation-meta'>
          <span className='meta-item'>
            <strong>Priority:</strong> {recommendation.task.priority}
          </span>
          {recommendation.task.estimatedTime > 0 && (
            <span className='meta-item'>
              <strong>Est. Time:</strong> {recommendation.task.estimatedTime}m
            </span>
          )}
          {recommendation.task.dueDate && (
            <span className='meta-item'>
              <strong>Due:</strong> {new Date(recommendation.task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}