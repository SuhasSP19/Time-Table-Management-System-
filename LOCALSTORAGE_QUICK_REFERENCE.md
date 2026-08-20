# LocalStorage System - API Quick Reference

## 🚀 Quick Access

### Access the System
```javascript
window.LS                    // Main namespace
window.LS.debugStorageInfo() // View all data
```

---

## 💾 SAVE FUNCTIONS

### User Data
| Function | Purpose | Example |
|----------|---------|---------|
| `saveUserSession(data)` | Save logged-in user | `window.LS.saveUserSession({id, name, role})` |
| `saveCurrentUser(id, name, role)` | Save current user | `window.LS.saveCurrentUser('hod_1', 'Dr. X', 'hod')` |
| `saveCurrentRole(role)` | Save selected role | `window.LS.saveCurrentRole('hod')` |
| `saveCurrentInstitution(id, name)` | Save institution | `window.LS.saveCurrentInstitution('SIT', 'SIT')` |

### Application Data
| Function | Purpose | Example |
|----------|---------|---------|
| `saveFacultyPreferences(prefs)` | Save course prefs | `window.LS.saveFacultyPreferences({...})` |
| `saveHODSubjectAssignments(assign)` | Save assignments | `window.LS.saveHODSubjectAssignments({...})` |
| `saveLeaveRecords(leaves)` | Save leave requests | `window.LS.saveLeaveRecords([...])` |
| `saveSubstitutions(subs)` | Save substitutions | `window.LS.saveSubstitutions([...])` |
| `saveUserSettings(settings)` | Save preferences | `window.LS.saveUserSettings({...})` |

---

## 📂 LOAD FUNCTIONS

### User Data
| Function | Returns | Example |
|----------|---------|---------|
| `loadUserSession()` | Object \| null | `const s = window.LS.loadUserSession()` |
| `loadCurrentUser()` | Object \| null | `const u = window.LS.loadCurrentUser()` |
| `loadCurrentRole()` | String \| null | `const r = window.LS.loadCurrentRole()` |
| `loadCurrentInstitution()` | Object \| null | `const i = window.LS.loadCurrentInstitution()` |

### Application Data
| Function | Returns | Example |
|----------|---------|---------|
| `loadFacultyPreferences()` | Object | `const p = window.LS.loadFacultyPreferences()` |
| `loadHODSubjectAssignments()` | Object | `const a = window.LS.loadHODSubjectAssignments()` |
| `loadLeaveRecords()` | Array | `const l = window.LS.loadLeaveRecords()` |
| `loadSubstitutions()` | Array | `const s = window.LS.loadSubstitutions()` |
| `loadUserSettings()` | Object | `const st = window.LS.loadUserSettings()` |

---

## 🔧 UTILITY FUNCTIONS

| Function | Purpose | Returns |
|----------|---------|---------|
| `getStorageStats()` | Get storage info | Object with stats |
| `getLastSavedTimestamp()` | Last save time | ISO string \| null |
| `updateLastSavedTimestamp()` | Update save time | void |
| `calculateStorageUsage()` | Storage in KB | String (e.g., "45.32 KB") |
| `clearUserSession()` | Clear session only | void |
| `clearAllAppData()` | Clear ops data | void |
| `clearEverything()` | Delete all data | void |
| `autoSaveBackup()` | Trigger backup | void |
| `debugStorageInfo()` | Log debug info | void (logs to console) |
| `initializeFromStorage()` | Restore on load | Object with stats |

---

## 📤 EXPORT/IMPORT

| Function | Purpose | Example |
|----------|---------|---------|
| `exportAllData()` | Download JSON backup | `window.LS.exportAllData()` |
| `importData(jsonString)` | Restore from JSON | `window.LS.importData(jsonData)` |

---

## 📋 STORAGE KEYS

Used internally - reference only:

```javascript
tms_userSession              // User login info
tms_currentUser              // Active user
tms_currentRole              // Selected role
tms_currentInstitution       // Selected institution
tms_facultyPreferences       // Course preferences
tms_hodSubjectAssignments    // Subject assignments
tms_leaveRecords             // Leave requests
tms_substitutions            // Substitutions
tms_userSettings             // User preferences
tms_lastSaved                // Last save timestamp
tms_appVersion               // App version
```

---

## 🎯 COMMON OPERATIONS

### Check Storage Status
```javascript
window.LS.getStorageStats()
```

### View All Data (Formatted)
```javascript
window.LS.debugStorageInfo()
```

### Restore All Data
```javascript
window.LS.initializeFromStorage()
```

### Manual Save Faculty Prefs
```javascript
window.LS.saveFacultyPreferences({
  'fac_001': {facultyName: 'Dr. X', status: 'submitted'}
})
```

### Manual Save HOD Assignments
```javascript
window.LS.saveHODSubjectAssignments({
  'hod_001': {assignedSubjects: ['CN', 'IoT']}
})
```

### Export Backup
```javascript
window.LS.exportAllData()
```

### Start Fresh
```javascript
window.LS.clearEverything()
location.reload()
```

### Logout User
```javascript
window.LS.clearUserSession()
```

---

## 🔍 RETURN VALUES

### getStorageStats()
```javascript
{
  userSession: 'saved' | 'empty',
  currentUser: 'saved' | 'empty',
  currentRole: 'saved' | 'empty',
  institution: 'saved' | 'empty',
  facultyPreferences: 'saved' | 'empty',
  hodAssignments: 'saved' | 'empty',
  leaveRecords: 'saved' | 'empty',
  substitutions: 'saved' | 'empty',
  lastSaved: '2024-01-15T10:30:00Z' | null,
  totalStorageUsed: '45.32 KB'
}
```

### loadFacultyPreferences()
```javascript
{
  'fac_001': {
    facultyName: 'Dr. Name',
    designation: 'Professor',
    corePreferences: [...],
    labPreferences: [...],
    status: 'submitted' | 'approved'
  }
}
```

### loadLeaveRecords()
```javascript
[
  {
    id: 'leave_001',
    faculty_id: 'Nirmala',
    leave_date: '2024-01-20',
    leave_type: 'Medical Leave',
    reason: 'reason',
    status: 'approved' | 'pending' | 'rejected'
  }
]
```

---

## ⚠️ IMPORTANT NOTES

1. **Auto-save Every 5 Min**: Don't worry about manual saves
2. **Data Survives**: Page refresh, browser restart, etc.
3. **NOT Encrypted**: Don't store passwords or secrets
4. **Storage Limit**: 5-10 MB (TMS uses ~50-500 KB)
5. **Returns Empty**: Load functions return {} or [] if no data

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| `window.LS undefined` | Load localStorage.js first |
| Data not saving | Check browser privacy settings |
| Import fails | Verify JSON format |
| Storage full | Run `window.LS.clearAllAppData()` |

---

## 🧪 TESTING

Open LOCALSTORAGE_TESTER.html in browser for:
- Interactive function testing
- Save/load verification
- Export/import testing
- Full test suite

---

## 📞 HELP

1. **API Docs**: See LOCALSTORAGE_GUIDE.md
2. **Quick Start**: See QUICKSTART.md
3. **Implementation**: See IMPLEMENTATION_SUMMARY.md
4. **Source**: Review localStorage.js
5. **Test**: Open LOCALSTORAGE_TESTER.html

---

**Keep this handy for quick function lookup!** 📌
