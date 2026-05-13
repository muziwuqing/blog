import { useEffect, useState, type ReactNode } from 'preact/compat';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
