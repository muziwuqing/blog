import { useEffect, useState } from 'preact/compat';
import Pkg from '@tsparticles/preact';
import { loadSlim } from '@tsparticles/slim';

const Particles = Pkg.Particles;
const initParticlesEngine = Pkg.initParticlesEngine;

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (initParticlesEngine) {
      initParticlesEngine(async (engine: any) => {
        await loadSlim(engine);
      }).then(() => setInit(true));
    } else {
      setInit(true);
    }
  }, []);

  if (!init) return null;

  const isDark = typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false;

  return (
    <Particles
      id="hero-particles"
      class="absolute inset-0 z-0"
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: isDark ? '#60a5fa' : '#3b82f6' },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.8,
            direction: 'none' as const,
            random: true,
            straight: false,
            outModes: { default: 'out' as const },
          },
          links: {
            enable: true,
            distance: 150,
            color: isDark ? '#60a5fa' : '#3b82f6',
            opacity: 0.15,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.3 } },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
