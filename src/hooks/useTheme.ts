import { useCallback, useState } from 'react';

type Mode = 'dark' | 'light' | 'auto';

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

function useTheme(): [Mode, (value: Mode) => void] {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const theme = localStorage?.getItem('theme') as Mode;
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'auto') return darkMode ? 'dark' : 'light';
      if (theme) return theme;
      const html = document.getElementsByTagName('html')[0];
      if (html.className.includes('dark')) return 'dark';
      if (html.className.includes('light')) return 'light';
      return darkMode ? 'dark' : 'light';
    }
    return 'light'; // 表示不支持暗色模式
  });

  const handleChangeMode = useCallback((value: Mode) => {
    setMode(value);
    localStorage?.setItem('theme', value);
    if (value === 'dark' || value === 'light') {
      changeTheme(value);
    } else {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      changeTheme(darkMode ? 'dark' : 'light');
    }
  }, []);

  return [mode, handleChangeMode];
}

export default useTheme;
