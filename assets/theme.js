const body = document.body;
const toggleBtns = document.querySelectorAll('.toggleBtn');

const STORAGE_KEY = 'user-theme-preference';
const DARK_CLASS = 'dark-mode';
const LIGHT_CLASS = 'light-mode';
const DARK_VALUE = 'dark';
const LIGHT_VALUE = 'light';
const SUN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 256 256"><rect fill="none"/><line x1="128" y1="40" x2="128" y2="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="64" x2="48" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="192" x2="48" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="192" y1="64" x2="208" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="192" y1="192" x2="208" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="40" y1="128" x2="16" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="216" x2="128" y2="240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="216" y1="128" x2="240" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
`
const MOON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 256 256"><rect fill="none"/><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
`

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_VALUE;
  }
  return LIGHT_VALUE;
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK_VALUE || stored === LIGHT_VALUE) {
      return stored;
    }
  } catch (error) {
    console.warn('localStorage access failed');
  }
  return null;
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    return true;
  } catch (e) {
    return false;
  }
}

function applyTheme(theme) {
  body.classList.remove(DARK_CLASS, LIGHT_CLASS);
  
  if (theme === DARK_VALUE) {
    body.classList.add(DARK_CLASS);
  } else {
    body.classList.add(LIGHT_CLASS);
  }
}

function updateButtonsUI(activeTheme) {
  const isDark = activeTheme === DARK_VALUE;
  
  toggleBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    
    // ⬇️ ADD YOUR SVG SWAP HERE ⬇️
    if (isDark) {
      btn.innerHTML = `${MOON_SVG} Light`;  // Replace with your sun SVG + "Light" text
    } else {
      btn.innerHTML = `${SUN_SVG} Dark`;   // Replace with your moon SVG + "Dark" text
    }
    // ⬆️ END SVG SWAP ⬆️
  });
}

function getInitialTheme() {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }
  return getSystemTheme();
}

function handleToggle() {
  const isCurrentlyDark = body.classList.contains(DARK_CLASS);
  const newTheme = isCurrentlyDark ? LIGHT_VALUE : DARK_VALUE;
  
  applyTheme(newTheme);
  saveThemePreference(newTheme);
  updateButtonsUI(newTheme);
}

function setupSystemThemeListener() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemChange = (event) => {
    const stored = getStoredTheme();
    if (stored) {
      return;
    }
    
    const newSystemTheme = event.matches ? DARK_VALUE : LIGHT_VALUE;
    applyTheme(newSystemTheme);
    updateButtonsUI(newSystemTheme);
  };
  
  if (darkModeMediaQuery.addEventListener) {
    darkModeMediaQuery.addEventListener('change', handleSystemChange);
  } else {
    darkModeMediaQuery.addListener(handleSystemChange);
  }
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    const newStoredValue = event.newValue;
    if (newStoredValue === DARK_VALUE || newStoredValue === LIGHT_VALUE) {
      applyTheme(newStoredValue);
      updateButtonsUI(newStoredValue);
    } else if (newStoredValue === null) {
      const systemNow = getSystemTheme();
      applyTheme(systemNow);
      updateButtonsUI(systemNow);
    }
  }
});

const initialTheme = getInitialTheme();
applyTheme(initialTheme);
updateButtonsUI(initialTheme);

toggleBtns.forEach(btn => {
  btn.addEventListener('click', handleToggle);
});

setupSystemThemeListener();
