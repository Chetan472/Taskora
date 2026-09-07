import React from 'react'

export default function ImportExport({ tasks, onImport }) {
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskora-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    const headers = ['Task', 'Priority', 'Category', 'Due Date', 'Estimated Time', 'Status'];
    const rows = tasks.map(t => [
      t.text,
      t.priority,
      t.category,
      t.dueDate || '',
      t.estimatedTime || 0,
      t.completed ? 'Done' : 'Pending'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskora-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          onImport(imported);
          alert('✅ Tasks imported successfully!');
        } else {
          alert('❌ Invalid file format');
        }
      } catch (err) {
        alert('❌ Error parsing file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className='import-export'>
      <div className='export-section'>
        <h3>📤 Export Tasks</h3>
        <div className='export-buttons'>
          <button onClick={handleExport} className='btn-export'>
            📥 Export as JSON
          </button>
          <button onClick={handleExportCSV} className='btn-export'>
            📊 Export as CSV
          </button>
        </div>
        <p className='export-help'>Download your tasks for backup or sharing</p>
      </div>

      <div className='import-section'>
        <h3>📥 Import Tasks</h3>
        <label className='import-label'>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <span className='btn-import'>📤 Choose JSON File</span>
        </label>
        <p className='import-help'>Import previously exported tasks</p>
      </div>
    </div>
  );
}