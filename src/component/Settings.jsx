import React, { useState } from 'react'

export default function Settings({ theme, onThemeChange, onClearAll, onExportSettings }) {
  const [showDanger, setShowDanger] = useState(false);

  return (
    <div className='settings-page'>
      <h2>⚙️ Settings</h2>

      <div className='settings-section'>
        <h3>🎨 Appearance</h3>
        <div className='setting-item'>
          <label>Theme</label>
          <div className='theme-options'>
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              ☀️ Light
            </button>
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>

      <div className='settings-section'>
        <h3>🔔 Notifications</h3>
        <div className='setting-item'>
          <label>
            <input type="checkbox" defaultChecked /> Enable notifications
          </label>
        </div>
        <div className='setting-item'>
          <label>
            <input type="checkbox" defaultChecked /> Remind me of overdue tasks
          </label>
        </div>
        <div className='setting-item'>
          <label>
            <input type="checkbox" defaultChecked /> Notify when due within 24h
          </label>
        </div>
      </div>

      <div className='settings-section'>
        <h3>⏱️ Pomodoro Settings</h3>
        <div className='setting-item'>
          <label>Work Duration (minutes)</label>
          <input type="number" defaultValue="25" min="1" />
        </div>
        <div className='setting-item'>
          <label>Break Duration (minutes)</label>
          <input type="number" defaultValue="5" min="1" />
        </div>
      </div>

      <div className='settings-section'>
        <h3>💾 Data & Backup</h3>
        <button className='btn-export-settings' onClick={onExportSettings}>
          📤 Export Settings & Tasks
        </button>
      </div>

      <div className='settings-section danger-zone'>
        <h3>⚠️ Danger Zone</h3>
        {!showDanger ? (
          <button className='btn-danger' onClick={() => setShowDanger(true)}>
            Show Danger Zone
          </button>
        ) : (
          <>
            <p className='warning-text'>These actions cannot be undone!</p>
            <button className='btn-delete-all' onClick={onClearAll}>
              🗑️ Clear All Tasks
            </button>
            <button className='btn-cancel' onClick={() => setShowDanger(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}