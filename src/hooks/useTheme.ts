import { useCallback, useState } from 'react';

type Theme = 'dark' | 'light';
type Mode = Theme | 'auto';

type UseThemeArray = [Mode, (mode: Mode) => void, Theme];

interface UseThemeObject {
  mode: Mode;
  currentTheme: Theme;
  onChange: (mode: Mode) => void;
}

const changeTheme = (theme: 'dark' | 'light') => {
  const html = document.getElementsByTagName('html')[0];
  html.classList.remove(theme === 'light' ? 'dark' : 'light');
  html.classList.add(theme);
  html.style.colorScheme = theme;
  document.body.setAttribute('theme-mode', theme);
  if (theme === 'light' && document.body.hasAttribute('theme-mode')) {
    document.body.removeAttribute('theme-mode');
  }
};

function useTheme(): UseThemeArray & UseThemeObject {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const theme = localStorage?.getItem('theme') as Mode;
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme) return theme;
      const html = document.getElementsByTagName('html')[0];
      if (html.className.includes('dark')) return 'dark';
      if (html.className.includes('light')) return 'light';
      return darkMode ? 'dark' : 'light';
    }
    return 'light'; // 表示不支持暗色模式
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (mode === 'auto') {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return darkMode ? 'dark' : 'light';
    }
    return mode;
  });

  const handleChangeMode = useCallback((value: Mode) => {
    setMode(value);
    localStorage?.setItem('theme', value);
    if (value === 'dark' || value === 'light') {
      changeTheme(value);
      setCurrentTheme(value);
    } else {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const currentMode = darkMode ? 'dark' : 'light';
      changeTheme(currentMode);
      setCurrentTheme(currentMode);
    }
  }, []);

  const ret = [mode, handleChangeMode, currentTheme] as UseThemeArray & UseThemeObject;

  ret.mode = mode;
  ret.currentTheme = currentTheme;
  ret.onChange = handleChangeMode;

  return ret;
}

export default useTheme;
