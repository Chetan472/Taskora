import React, { useState, useMemo } from 'react'

export default function FilterSort({ tasks, onFilteredTasksChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // "all", "completed", "active", "overdue"
  const [sortBy, setSortBy] = useState('due-date'); // "due-date", "priority", "created", "name"

  // Get unique categories
  const categories = ['all', ...new Set(tasks.map(t => t.category))];

  // Filter and sort logic
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.text.toLowerCase().includes(term) || 
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      result = result.filter(t => t.priority === filterPriority);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Status filter
    if (filterStatus === 'completed') {
      result = result.filter(t => t.completed);
    } else if (filterStatus === 'active') {
      result = result.filter(t => !t.completed);
    } else if (filterStatus === 'overdue') {
      result = result.filter(t => {
        if (!t.dueDate || t.completed) return false;
        return new Date(t.dueDate) < new Date();
      });
    }

    // Sort
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'due-date':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchTerm, filterPriority, filterCategory, filterStatus, sortBy]);

  // Notify parent of filtered tasks
  React.useEffect(() => {
    onFilteredTasksChange(filteredTasks);
  }, [filteredTasks, onFilteredTasksChange]);

  return (
    <div className='filter-sort-panel'>
      <div className='search-box'>
        <input
          type="text"
          placeholder='🔍 Search tasks...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='filters-row'>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className='filter-select'>
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className='filter-select'>
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className='filter-select'>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='filter-select'>
          <option value="due-date">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="created">Sort: Created</option>
          <option value="name">Sort: A-Z</option>
        </select>
      </div>

      <div className='filter-results'>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>
    </div>
  );
}