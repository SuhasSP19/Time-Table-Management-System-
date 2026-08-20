# LocalStorage Persistence System - Implementation Guide

## Overview

The TMS (Timetable Management System) now includes a comprehensive LocalStorage persistence system that automatically saves and restores all application data across page refreshes and browser sessions.

## Files Added

1. **localStorage.js** - Core persistence module with all save/load/export functions
2. **Updated tms.html** - Integrated localStorage with auto-save hooks

## Data Persistence Coverage

### User Session Data
- Current user information
- User role
- Institution selection
- Login timestamp

### Faculty Data
- Faculty preferences and submissions
- Faculty course preferences (core & lab)
- Faculty availability

### HOD Data
- HOD subject assignments
- HOD course allocations
- HOD approvals and assignments

### Operational Data
- Leave records
- Faculty substitutions
- Room bookings

## Quick Start

### Automatic Data Persistence

Data is automatically persisted when:
1. **Page loads** - All saved data is restored from localStorage
2. **User actions** - Data is saved whenever faculty preferences are submitted
3. **HOD approvals** - HOD assignments are saved automatically
4. **Periodic save** - Auto-save every 5 minutes (configurable)

### Manual Operations

Access the persistence system through the global `window.LS` object:

```javascript
// Load data
const preferences = window.LS.loadFacultyPreferences();
const assignments = window.LS.loadHODSubjectAssignments();

// Save data
window.LS.saveFacultyPreferences(preferences);
window.LS.saveHODSubjectAssignments(assignments);

// Get storage info
const stats = window.LS.getStorageStats();
console.log(stats);

// Export all data to JSON file
window.LS.exportAllData();

// Clear data
window.LS.clearAllAppData();      // Clear only operational data
window.LS.clearEverything();      // Clear absolutely everything
```

## Storage Structure

All data is stored in browser's localStorage with the following keys:

```
tms_userSession              → Current user login info
tms_currentUser              → Active user details
tms_currentRole              → Selected role
tms_currentInstitution       → Selected institution
tms_facultyPreferences       → Faculty course preferences
tms_hodSubjectAssignments    → HOD course assignments
tms_leaveRecords             → Faculty leave applications
tms_substitutions            → Faculty substitutions
tms_userSettings             → User preferences/settings
tms_lastSaved                → Timestamp of last save
tms_appVersion               → App version info
```

## API Reference

### Save Functions

#### `saveUserSession(userData)`
Saves the current user's session data.
```javascript
window.LS.saveUserSession({
  id: 'hod_sunitha',
  name: 'Dr. N R Sunitha',
  role: 'hod',
  institution: 'SIT'
});
```

#### `saveFacultyPreferences(preferences)`
Saves faculty course preferences.
```javascript
window.LS.saveFacultyPreferences(facultyPreferencesObject);
```

#### `saveHODSubjectAssignments(assignments)`
Saves HOD's subject assignments.
```javascript
window.LS.saveHODSubjectAssignments(hodAssignmentsObject);
```

#### `saveLeaveRecords(leaveRecords)`
Saves faculty leave records.
```javascript
window.LS.saveLeaveRecords(leaveRecordsArray);
```

#### `saveSubstitutions(substitutions)`
Saves faculty substitution records.
```javascript
window.LS.saveSubstitutions(substitutionsArray);
```

#### `saveUserSettings(settings)`
Saves user preferences and settings.
```javascript
window.LS.saveUserSettings(settingsObject);
```

### Load Functions

#### `loadUserSession()`
Retrieves the saved user session.
```javascript
const session = window.LS.loadUserSession();
// Returns: {id, name, role, institution, loginTime, lastActivity}
```

#### `loadFacultyPreferences()`
Retrieves saved faculty preferences.
```javascript
const prefs = window.LS.loadFacultyPreferences();
// Returns: Object or {}
```

#### `loadHODSubjectAssignments()`
Retrieves saved HOD assignments.
```javascript
const assignments = window.LS.loadHODSubjectAssignments();
// Returns: Object or {}
```

#### `loadLeaveRecords()`
Retrieves saved leave records.
```javascript
const leaves = window.LS.loadLeaveRecords();
// Returns: Array or []
```

#### `loadSubstitutions()`
Retrieves saved substitutions.
```javascript
const subs = window.LS.loadSubstitutions();
// Returns: Array or []
```

#### `loadUserSettings()`
Retrieves saved user settings.
```javascript
const settings = window.LS.loadUserSettings();
// Returns: Object or {}
```

### Utility Functions

#### `getStorageStats()`
Returns comprehensive storage information.
```javascript
const stats = window.LS.getStorageStats();
// Returns: {
//   userSession: 'saved' | 'empty',
//   currentUser: 'saved' | 'empty',
//   facultyPreferences: 'saved' | 'empty',
//   hodAssignments: 'saved' | 'empty',
//   leaveRecords: 'saved' | 'empty',
//   substitutions: 'saved' | 'empty',
//   lastSaved: '2024-01-15T10:30:00.000Z',
//   totalStorageUsed: '23.45 KB'
// }
```

#### `getLastSavedTimestamp()`
Returns ISO timestamp of last save.
```javascript
const lastSave = window.LS.getLastSavedTimestamp();
```

#### `updateLastSavedTimestamp()`
Manually update the last save timestamp.
```javascript
window.LS.updateLastSavedTimestamp();
```

#### `clearUserSession()`
Clears only user session data (keeps app data).
```javascript
window.LS.clearUserSession();
```

#### `clearAllAppData()`
Clears operational data but keeps user session.
```javascript
window.LS.clearAllAppData();
```

#### `clearEverything()`
Completely clears all localStorage data.
```javascript
window.LS.clearEverything();
```

### Export/Import Functions

#### `exportAllData()`
Exports all data to a JSON file download.
```javascript
window.LS.exportAllData();
// Downloads: tms-data-backup-2024-01-15.json
```

#### `importData(jsonString)`
Imports data from JSON string.
```javascript
const jsonData = '{"facultyPreferences": {...}, ...}';
const success = window.LS.importData(jsonData);
// Returns: true if successful, false otherwise
```

### Debug Function

#### `debugStorageInfo()`
Logs complete storage information to console.
```javascript
window.LS.debugStorageInfo();
// Logs all stored data to browser console in organized groups
```

## Browser Console Usage

Open browser Developer Tools (F12 or Ctrl+Shift+I) → Console tab and use:

```javascript
// View all storage stats
window.LS.getStorageStats()

// View detailed storage info (formatted)
window.LS.debugStorageInfo()

// Export data
window.LS.exportAllData()

// Clear all data
window.LS.clearEverything()

// Restore data
const session = window.LS.loadUserSession()
const prefs = window.LS.loadFacultyPreferences()
```

## Features

✅ **Automatic Persistence** - Data saved on every change
✅ **Session Recovery** - Restores user session on page load
✅ **Data Export** - Download all data as JSON backup
✅ **Data Import** - Restore from JSON backup file
✅ **Storage Monitoring** - Track what's stored and storage usage
✅ **Error Handling** - Graceful fallback if localStorage is full/unavailable
✅ **Periodic Auto-save** - Saves every 5 minutes as backup
✅ **Debug Info** - Comprehensive logging for troubleshooting

## Data Restoration Flow

When the app loads:
1. localStorage.js is loaded
2. DOMContentLoaded event fires
3. All saved data is loaded into memory
4. Faculty preferences are restored
5. HOD assignments are restored
6. Leave records and substitutions are restored
7. Storage stats are logged to console

## Persistence Lifecycle

```
User Logs In
    ↓
Session saved to localStorage
    ↓
App Operations
(preferences submitted, assignments made, etc.)
    ↓
Data auto-saved to localStorage
    ↓
Page Refresh / Browser Close
    ↓
On Next Page Load
    ↓
Data restored from localStorage
    ↓
User continues work
```

## Important Notes

### Storage Limits
- Most browsers allow ~5-10MB of localStorage per domain
- Current TMS typically uses 50-500 KB depending on data volume

### Data Persistence Duration
- Data persists across:
  - Page refreshes (F5, Ctrl+R)
  - Browser restarts
  - Window/tab closures
  
- Data is cleared when:
  - User clears browser history/cache
  - User manually clears localStorage
  - Browser storage is manually wiped

### Security Considerations
- localStorage is NOT encrypted
- Do NOT store sensitive passwords or tokens
- User session IDs and personal data are stored locally
- In production, use secure cookies and server-side sessions

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Not available in private/incognito mode on some browsers
- Requires localStorage enabled in browser settings

## Troubleshooting

### Data Not Persisting?
1. Check if localStorage is enabled in browser settings
2. Check browser console for errors: `window.LS.debugStorageInfo()`
3. Check storage available: `window.LS.getStorageStats()`

### Storage Full?
1. Clear unnecessary data: `window.LS.clearAllAppData()`
2. Export important data first: `window.LS.exportAllData()`
3. Import data on clean browser

### Data Corrupted?
1. Clear everything: `window.LS.clearEverything()`
2. Reload page (forces fresh initialization)
3. Re-submit data through normal app flow

## Development Guidelines

### Adding New Persistent Data

1. Define a new key in `STORAGE_KEYS`
2. Create save function: `save[DataName](data)`
3. Create load function: `load[DataName]()`
4. Add to export/import functions
5. Hook into appropriate event handlers

Example:
```javascript
// In localStorage.js
const STORAGE_KEYS = {
  // ... existing keys ...
  NEW_DATA_TYPE: 'tms_newDataType'
};

function saveNewDataType(data) {
  localStorage.setItem(STORAGE_KEYS.NEW_DATA_TYPE, JSON.stringify(data));
  updateLastSavedTimestamp();
}

function loadNewDataType() {
  const data = localStorage.getItem(STORAGE_KEYS.NEW_DATA_TYPE);
  return data ? JSON.parse(data) : {};
}

// Add to window.LS object
window.LS.saveNewDataType = saveNewDataType;
window.LS.loadNewDataType = loadNewDataType;
```

## Support & Maintenance

The localStorage system is designed to be:
- **Self-contained** - No external dependencies
- **Extensible** - Easy to add new data types
- **Transparent** - Clear logging and debug info
- **Robust** - Error handling and fallbacks

For issues or enhancements, refer to the browser console debug info or review the localStorage.js source code.

---

## Summary

Your TMS now has full data persistence! All faculty preferences, HOD assignments, and operational data are automatically saved and restored. Users can work offline and continue seamlessly after page refreshes.

**Key Takeaway**: No data is lost on page refresh—everything is stored in browser localStorage and restored automatically.
