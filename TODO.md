# LocalStorage Fix Plan - IN PROGRESS

## Issues Found

### 1. SYNTAX ERROR in `tms.html` - Unclosed IIFE + try block
- Line ~494: IIFE `(function() { ... try { ...` is never closed
- Missing `catch(e) { } })();` causes entire script to fail parsing

### 2. SYNTAX ERROR in `tms.html` - "SUBSTITUTE ENGINE" not commented
- Line ~506: Raw text `SUBSTITUTE ENGINE` parsed as JS code
- Needs `/* ------------------------------------------------------------ SUBSTITUTE ENGINE ------------------------------------------------------------ */` wrapper

### 3. SYNTAX ERROR in `preference.html` - Broken localStorage.setItem
- Missing closing `');` on `localStorage.setItem('tms_facultyPreferences', ...)` line

### 4. Script loading order in `tms.html`
- `localStorage.js` loads AFTER inline script
- Should load BEFORE so `window.LS` is available

---

## Fix Steps

- [ ] Fix tms.html: Close IIFE try/catch block
- [ ] Fix tms.html: Wrap "SUBSTITUTE ENGINE" in comment
- [ ] Fix preference.html: Complete broken localStorage.setItem line
- [ ] Fix tms.html: Move localStorage.js script tag before inline script
- [ ] Verify all files use consistent `tms_` prefixed keys
- [ ] Test in browser

