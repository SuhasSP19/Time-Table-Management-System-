function vPreferenceSubmissions() {
  setPage('Faculty Course Preferences', 'Review & approve submissions', '');

  // Load submissions from localStorage
  let submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');

  if (submissions.length === 0) {
    setBody('<div style="text-align:center;padding:60px;color:var(--ink3)"><div style="font-size:36px;margin-bottom:12px">📝</div><div style="font-size:16px;margin-bottom:8px">No submissions yet</div><div style="font-size:12px">Faculty will submit preferences here after filling preference.html form.</div></div>');
    return;
  }

  let h = `<div class="stats">
    <div class="stat"><div class="stat-n" style="color:var(--blue)">${submissions.length}</div><div class="stat-l">Total</div></div>
    <div class="stat"><div class="stat-n" style="color:var(--green)">${submissions.filter(s => s.status === 'approved').length}</div><div class="stat-l">Approved</div></div>
    <div class="stat"><div class="stat-n" style="color:var(--amber)">${submissions.filter(s => s.status === 'submitted').length}</div><div class="stat-l">Pending</div></div>
  </div>`;

  h += `<div class="card">
    <div class="card-title">Submissions <button class="btn btn-green btn-sm" onclick="exportPreferences()">📤 Export to Coordinator</button></div>
    <div style="overflow-x:auto">
      <table class="dt">
        <thead><tr><th>Faculty</th><th>Designation</th><th>Python Taught</th><th>Core Prefs</th><th>Lab Prefs</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>`;

  submissions.forEach(sub => {
    h += `<tr>
      <td style="font-weight:600">${sub.facultyName}</td>
      <td>${sub.designation}</td>
      <td style="text-align:center;font-family:var(--mono);font-weight:700">${sub.pythonTimesTaught}</td>
      <td>${sub.corePreferences.length}</td>
      <td>${sub.labPreferences.length}</td>
      <td><span style="font-weight:700;text-transform:uppercase;color:${sub.status === 'approved' ? 'var(--green)' : 'var(--amber)'}">${sub.status}</span></td>
      <td>
        ${sub.status === 'submitted' ? 
          `<button class="btn btn-green btn-xs" onclick="approvePreference('${sub.id}')">Approve</button>` : 
          `<span style="color:var(--green)">✓ Approved</span>`
        }
        <button class="btn btn-xs" onclick="viewPreference('${sub.id}')">View</button>
        <button class="btn btn-red btn-xs" onclick="deletePreference('${sub.id}')">Delete</button>
      </td>
    </tr>`;
  });

  h += `</tbody></table>
    </div>
  </div>`;

  setBody(h);
}

function approvePreference(id) {
  let submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');
  const index = submissions.findIndex(s => s.id === id);
  if (index !== -1) {
    submissions[index].status = 'approved';
    submissions[index].hodApprovedAt = new Date().toISOString();
    localStorage.setItem('tms_facultyPreferences', JSON.stringify(submissions));
    toast('Preference approved!', 'success');
    vPreferenceSubmissions();
  }
}

function deletePreference(id) {
  if (!confirm('Delete this submission?')) return;
  let submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');
  submissions = submissions.filter(s => s.id !== id);
  localStorage.setItem('tms_facultyPreferences', JSON.stringify(submissions));
  toast('Submission deleted', 'ok');
  vPreferenceSubmissions();
}

function viewPreference(id) {
  const submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');
  const sub = submissions.find(s => s.id === id);
  if (!sub) return;

  let h = `<div class="modal-title">Preference Details <button class="modal-close" onclick="closeMo()">×</button></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div>
        <div style="font-weight:700;margin-bottom:8px">Faculty: ${sub.facultyName}</div>
        <div>Designation: ${sub.designation}</div>
        <div>Python taught: ${sub.pythonTimesTaught} times</div>
        <div>Core prefs: ${sub.corePreferences.length}</div>
        <div>Lab prefs: ${sub.labPreferences.length}</div>
        <div>Status: <span style="color:${sub.status === 'approved' ? 'var(--green)' : 'var(--amber)'};font-weight:700">${sub.status}</span></div>
      </div>
      <div>
        <details><summary style="cursor:pointer;font-weight:600;margin-bottom:8px">Core Preferences (${sub.corePreferences.length})</summary>
          <div style="font-size:11px">${sub.corePreferences.join(', ')}</div>
        </details>
        <details><summary style="cursor:pointer;font-weight:600;margin-top:8px">Lab Preferences (${sub.labPreferences.length})</summary>
          <div style="font-size:11px">${sub.labPreferences.join(', ')}</div>
        </details>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-blue" onclick="printPreference('${id}')">Print</button>
      <button class="btn" onclick="closeMo()">Close</button>
    </div>`;

  openMo(h);
}

function exportPreferences() {
  const submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');
  const approved = submissions.filter(s => s.status === 'approved');
  
  const report = {
    generatedBy: 'HOD - SIT TMS',
    timestamp: new Date().toISOString(),
    totalFaculty: submissions.length,
    approved: approved.length,
    coordinator: 'Timetable Coordinator',
    data: approved
  };

  const dataStr = JSON.stringify(report, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `faculty-preferences-approved-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  toast('Report exported to Timetable Coordinator!', 'success');
}

function printPreference(id) {
  const submissions = JSON.parse(localStorage.getItem('tms_facultyPreferences') || '[]');
  const sub = submissions.find(s => s.id === id);
  if (!sub) return;

  // Create printable version
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>Faculty Preference - ${sub.facultyName}</title>
        <style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}
          h1{font-size:24px;border-bottom:2px solid #2563eb;padding-bottom:10px}
          h2{font-size:18px;margin:20px 0 10px 0}
          table{width:100%;border-collapse:collapse;margin:10px 0}
          th,td{border:1px solid #d1d8e8;padding:8px;text-align:left}
          th{background:#1a2744;color:white}
          .status-approved{color:#16a34a;font-weight:bold}
          .submitted{color:#eab308;font-weight:bold}</style>
      </head>
      <body>
        <h1>Course Preference Form - ${sub.facultyName}</h1>
        <p><strong>Designation:</strong> ${sub.designation}</p>
        <p><strong>Python Programming taught:</strong> ${sub.pythonTimesTaught} times</p>
        <p><strong>Status:</strong> <span class="status-${sub.status}">${sub.status.toUpperCase()}</span></p>
        
        <h2>Core Course Preferences (${sub.corePreferences.length})</h2>
        <table>
          <tr><th>#</th><th>Course</th></tr>
          ${sub.corePreferences.map((pref,i) => `<tr><td>${i+1}</td><td>${pref}</td></tr>`).join('')}
        </table>
        
        <h2>Laboratory Course Preferences (${sub.labPreferences.length})</h2>
        <table>
          <tr><th>#</th><th>Lab Course</th></tr>
          ${sub.labPreferences.map((pref,i) => `<tr><td>${i+1}</td><td>${pref}</td></tr>`).join('')}
        </table>
        
        <p style="margin-top:30px;font-size:12px;color:#6b7280">
          Generated by SIT TMS on ${new Date(sub.timestamp).toLocaleString()} | Approved: ${sub.hodApprovedAt ? new Date(sub.hodApprovedAt).toLocaleString() : 'Pending'}
        </p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

