import { useEffect, useState } from 'preact/compat';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      class="relative h-8 w-8 rounded-full border border-border bg-card hover:bg-border transition-colors dark:border-border-dark dark:bg-card-dark dark:hover:bg-border-dark"
      aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span class="absolute inset-0 flex items-center justify-center text-sm transition-transform duration-500">
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
