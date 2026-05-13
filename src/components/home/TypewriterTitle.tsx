import { useEffect, useRef } from 'preact/compat';

interface Props {
  texts: string[];
  className?: string;
}

export default function TypewriterTitle({ texts, className = '' }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function type() {
      const current = texts[textIndex];

      if (isDeleting) {
        el!.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el!.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 300;
      }

      timeoutId = setTimeout(type, speed);
    }

    timeoutId = setTimeout(type, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span ref={spanRef} class={`${className} after:content-['|'] after:animate-pulse after:ml-0.5`} />
  );
}
