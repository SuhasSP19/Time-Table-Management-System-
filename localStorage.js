/* ════════════════════════════════════════════════════════════
   LOCALSTORAGE PERSISTENCE SYSTEM
   Comprehensive data persistence across page refreshes
════════════════════════════════════════════════════════════ */

const STORAGE_KEYS = {
  // User session data
  USER_SESSION: 'tms_userSession',
  CURRENT_USER: 'tms_currentUser',
  CURRENT_ROLE: 'tms_currentRole',
  CURRENT_INSTITUTION: 'tms_currentInstitution',
  
  // Faculty preferences
  FACULTY_PREFERENCES: 'tms_facultyPreferences',
  
  // HOD assignments
  HOD_SUBJECT_ASSIGNMENTS: 'tms_hodSubjectAssignments',
  // HOD user credentials
  HOD_USERS: 'tms_hodUsers',
  
  // Leave records
  LEAVE_RECORDS: 'tms_leaveRecords',
  
  // Substitutions
  SUBSTITUTIONS: 'tms_substitutions',
  
  // User preferences/settings
  USER_SETTINGS: 'tms_userSettings',
  
  // App metadata
  APP_LAST_SAVED: 'tms_lastSaved',
  APP_VERSION: 'tms_appVersion',
};

/* ════════════════════════════════════════════════════════════
   SAVE FUNCTIONS
════════════════════════════════════════════════════════════ */

function saveUserSession(userData) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify({
      id: userData.id,
      name: userData.name,
      role: userData.role,
      institution: userData.institution,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }));
  } catch(e) {
    console.warn('Failed to save user session:', e);
  }
}

function saveCurrentUser(userId, userName, role) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
      id: userId,
      name: userName,
      role: role,
      timestamp: new Date().toISOString()
    }));
  } catch(e) {
    console.warn('Failed to save current user:', e);
  }
}

function saveCurrentRole(role) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  } catch(e) {
    console.warn('Failed to save current role:', e);
  }
}

function saveCurrentInstitution(institutionId, institutionName) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INSTITUTION, JSON.stringify({
      id: institutionId,
      name: institutionName,
      timestamp: new Date().toISOString()
    }));
  } catch(e) {
    console.warn('Failed to save current institution:', e);
  }
}

function saveFacultyPreferences(preferences) {
  try {
    localStorage.setItem(STORAGE_KEYS.FACULTY_PREFERENCES, JSON.stringify(preferences));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save faculty preferences:', e);
  }
}

function saveHODSubjectAssignments(assignments) {
  try {
    localStorage.setItem(STORAGE_KEYS.HOD_SUBJECT_ASSIGNMENTS, JSON.stringify(assignments));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save HOD subject assignments:', e);
  }
}

function saveHODUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.HOD_USERS, JSON.stringify(users));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save HOD users:', e);
  }
}

function saveLeaveRecords(leaveRecords) {
  try {
    localStorage.setItem(STORAGE_KEYS.LEAVE_RECORDS, JSON.stringify(leaveRecords));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save leave records:', e);
  }
}

function saveSubstitutions(substitutions) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSTITUTIONS, JSON.stringify(substitutions));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save substitutions:', e);
  }
}

function saveUserSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    updateLastSavedTimestamp();
  } catch(e) {
    console.warn('Failed to save user settings:', e);
  }
}

/* ════════════════════════════════════════════════════════════
   LOAD FUNCTIONS
════════════════════════════════════════════════════════════ */

function loadUserSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  } catch(e) {
    console.warn('Failed to load user session:', e);
    return null;
  }
}

function loadCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch(e) {
    console.warn('Failed to load current user:', e);
    return null;
  }
}

function loadCurrentRole() {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
  } catch(e) {
    console.warn('Failed to load current role:', e);
    return null;
  }
}

function loadCurrentInstitution() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_INSTITUTION);
    return data ? JSON.parse(data) : null;
  } catch(e) {
    console.warn('Failed to load current institution:', e);
    return null;
  }
}

function loadFacultyPreferences() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FACULTY_PREFERENCES);
    return data ? JSON.parse(data) : {};
  } catch(e) {
    console.warn('Failed to load faculty preferences:', e);
    return {};
  }
}

function loadHODSubjectAssignments() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOD_SUBJECT_ASSIGNMENTS);
    return data ? JSON.parse(data) : {};
  } catch(e) {
    console.warn('Failed to load HOD subject assignments:', e);
    return {};
  }
}

function loadHODUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOD_USERS);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    console.warn('Failed to load HOD users:', e);
    return [];
  }
}

function loadLeaveRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEAVE_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    console.warn('Failed to load leave records:', e);
    return [];
  }
}

function loadSubstitutions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSTITUTIONS);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    console.warn('Failed to load substitutions:', e);
    return [];
  }
}

function loadUserSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch(e) {
    console.warn('Failed to load user settings:', e);
    return {};
  }
}

/* ════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
════════════════════════════════════════════════════════════ */

function updateLastSavedTimestamp() {
  try {
    const timestamp = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.APP_LAST_SAVED, timestamp);
  } catch(e) {
    console.warn('Failed to update last saved timestamp:', e);
  }
}

function getLastSavedTimestamp() {
  try {
    return localStorage.getItem(STORAGE_KEYS.APP_LAST_SAVED);
  } catch(e) {
    console.warn('Failed to get last saved timestamp:', e);
    return null;
  }
}

function clearUserSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_INSTITUTION);
  } catch(e) {
    console.warn('Failed to clear user session:', e);
  }
}

function clearAllAppData() {
  try {
    // Keep user session data but clear operational data
    localStorage.removeItem(STORAGE_KEYS.FACULTY_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.HOD_SUBJECT_ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.LEAVE_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SUBSTITUTIONS);
    updateLastSavedTimestamp();
    return true;
  } catch(e) {
    console.warn('Failed to clear app data:', e);
    return false;
  }
}

function clearEverything() {
  try {
    // Clear absolutely everything
    for (let key in STORAGE_KEYS) {
      localStorage.removeItem(STORAGE_KEYS[key]);
    }
    return true;
  } catch(e) {
    console.warn('Failed to clear everything:', e);
    return false;
  }
}

function getStorageStats() {
  try {
    const stats = {
      userSession: localStorage.getItem(STORAGE_KEYS.USER_SESSION) ? 'saved' : 'empty',
      currentUser: localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ? 'saved' : 'empty',
      currentRole: localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) ? 'saved' : 'empty',
      institution: localStorage.getItem(STORAGE_KEYS.CURRENT_INSTITUTION) ? 'saved' : 'empty',
      facultyPreferences: localStorage.getItem(STORAGE_KEYS.FACULTY_PREFERENCES) ? 'saved' : 'empty',
      hodAssignments: localStorage.getItem(STORAGE_KEYS.HOD_SUBJECT_ASSIGNMENTS) ? 'saved' : 'empty',
      leaveRecords: localStorage.getItem(STORAGE_KEYS.LEAVE_RECORDS) ? 'saved' : 'empty',
      substitutions: localStorage.getItem(STORAGE_KEYS.SUBSTITUTIONS) ? 'saved' : 'empty',
      lastSaved: getLastSavedTimestamp(),
      totalStorageUsed: calculateStorageUsage()
    };
    return stats;
  } catch(e) {
    console.warn('Failed to get storage stats:', e);
    return {};
  }
}

function calculateStorageUsage() {
  try {
    let total = 0;
    for (let key in STORAGE_KEYS) {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      if (item) {
        total += item.length;
      }
    }
    // Convert to KB
    return (total / 1024).toFixed(2) + ' KB';
  } catch(e) {
    return 'N/A';
  }
}

/* ════════════════════════════════════════════════════════════
   EXPORT/IMPORT DATA
════════════════════════════════════════════════════════════ */

function exportAllData() {
  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      userSession: loadUserSession(),
      facultyPreferences: loadFacultyPreferences(),
      hodAssignments: loadHODSubjectAssignments(),
      leaveRecords: loadLeaveRecords(),
      substitutions: loadSubstitutions(),
      userSettings: loadUserSettings()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tms-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch(e) {
    console.error('Failed to export data:', e);
    return false;
  }
}

function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.userSession) saveUserSession(data.userSession);
    if (data.facultyPreferences) saveFacultyPreferences(data.facultyPreferences);
    if (data.hodAssignments) saveHODSubjectAssignments(data.hodAssignments);
    if (data.leaveRecords) saveLeaveRecords(data.leaveRecords);
    if (data.substitutions) saveSubstitutions(data.substitutions);
    if (data.userSettings) saveUserSettings(data.userSettings);
    
    updateLastSavedTimestamp();
    return true;
  } catch(e) {
    console.error('Failed to import data:', e);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   INITIALIZATION - Restore on page load
════════════════════════════════════════════════════════════ */

function initializeFromStorage() {
  try {
    console.log('🔄 Initializing from LocalStorage...');
    
    const stats = getStorageStats();
    console.log('📊 Storage Status:', stats);
    
    // Log what was restored
    if (loadUserSession()) console.log('✓ User session restored');
    if (loadFacultyPreferences()) console.log('✓ Faculty preferences restored');
    if (loadHODSubjectAssignments()) console.log('✓ HOD assignments restored');
    if (loadLeaveRecords().length > 0) console.log('✓ Leave records restored');
    if (loadSubstitutions().length > 0) console.log('✓ Substitutions restored');
    
    return stats;
  } catch(e) {
    console.error('Failed to initialize from storage:', e);
    return null;
  }
}

// Auto-save backup function - call periodically
function autoSaveBackup() {
  try {
    updateLastSavedTimestamp();
    console.log('💾 Auto-save backup created at ' + new Date().toLocaleTimeString());
  } catch(e) {
    console.warn('Auto-save backup failed:', e);
  }
}

// Set up periodic auto-save (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(autoSaveBackup, 5 * 60 * 1000);
}

/* ════════════════════════════════════════════════════════════
   DEBUG/INFO FUNCTIONS
════════════════════════════════════════════════════════════ */

function debugStorageInfo() {
  console.group('📦 LocalStorage Debug Info');
  console.log('Storage Stats:', getStorageStats());
  console.log('User Session:', loadUserSession());
  console.log('Faculty Preferences:', loadFacultyPreferences());
  console.log('HOD Assignments:', loadHODSubjectAssignments());
  console.log('Leave Records Count:', loadLeaveRecords().length);
  console.log('Substitutions Count:', loadSubstitutions().length);
  console.groupEnd();
}

// Make it globally accessible
window.LS = {
  // User data
  saveUserSession,
  loadUserSession,
  saveCurrentUser,
  loadCurrentUser,
  saveCurrentRole,
  loadCurrentRole,
  saveCurrentInstitution,
  loadCurrentInstitution,
  
  // Application data
  saveFacultyPreferences,
  loadFacultyPreferences,
  saveHODSubjectAssignments,
  loadHODSubjectAssignments,
  saveHODUsers,
  loadHODUsers,
  saveLeaveRecords,
  loadLeaveRecords,
  saveSubstitutions,
  loadSubstitutions,
  saveUserSettings,
  loadUserSettings,
  
  // Utilities
  updateLastSavedTimestamp,
  getLastSavedTimestamp,
  getStorageStats,
  clearUserSession,
  clearAllAppData,
  clearEverything,
  exportAllData,
  importData,
  initializeFromStorage,
  autoSaveBackup,
  debugStorageInfo
};

console.log('✅ LocalStorage system loaded. Use window.LS for all operations.');
