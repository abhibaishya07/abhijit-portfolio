export function initSecurityMeasures() {
  // Only apply these strict measures in production by default, or unconditionally if needed.
  // We'll apply it unconditionally since the user specifically requested it to be locked down.

  // Disable Right Click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable Keyboard Shortcuts for DevTools
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
    }
    // Ctrl+Shift+I (Windows) or Cmd+Opt+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
      e.preventDefault();
    }
    // Ctrl+Shift+J (Windows) or Cmd+Opt+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
    }
    // Ctrl+Shift+C (Windows) or Cmd+Opt+C (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
    }
    // Ctrl+U (Windows) or Cmd+U (Mac) - View Source
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }
  });

  // A basic anti-debugger trick (makes it extremely annoying to use the console)
  // This constantly triggers the debugger if devtools is open, effectively freezing it.
  if (import.meta.env.PROD) {
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      // If the execution took much longer than expected, the debugger likely paused it.
      if (end - start > 100) {
        document.body.innerHTML = "Security Risk Detected. Please close Developer Tools to continue using Kivara Beauty.";
      }
    }, 1000);
  }

  // Disable React DevTools globally
  if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
    }
  }
}
