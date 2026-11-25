import { useEffect, useRef } from 'react';

export type ParticleMode = 'hearts' | 'petals' | 'starlight';

interface ParticleCanvasProps {
  mode: ParticleMode;
  celebrating: boolean;
  burstTrigger: number;
  clearTrigger: number;
  density: 'gentle' | 'lush';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: number;
  saturation: number;
  lightness: number;
  rotation: number;
  rotationSpeed: number;
  kind: 'circle' | 'heart' | 'petal';
  ambient: boolean;
  phase: number;
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  fill: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = fill;

  const s = size * 0.55;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.15, s * 0.65, 0, s * 1.35);
  ctx.bezierCurveTo(s * 1.15, s * 0.65, s, -s * 0.4, 0, s * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  fill: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = fill;

  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.72, size * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function ParticleCanvas({
  mode,
  celebrating,
  burstTrigger,
  clearTrigger,
  density,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const modeRef = useRef<ParticleMode>(mode);
  const celebratingRef = useRef<boolean>(celebrating);
  const densityRef = useRef<'gentle' | 'lush'>(density);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  modeRef.current = mode;
  celebratingRef.current = celebrating;
  densityRef.current = density;

  const spawnBurst = (
    cx: number,
    cy: number,
    count: number,
    forceHeart = false
  ) => {
    const activeMode = modeRef.current;
    const paletteHues = [342, 348, 336, 354, 328];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const speed = 1.1 + Math.random() * 3.8;
      const kind: Particle['kind'] = forceHeart
        ? 'heart'
        : activeMode === 'hearts'
        ? Math.random() > 0.25
          ? 'heart'
          : 'circle'
        : activeMode === 'petals'
        ? Math.random() > 0.2
          ? 'petal'
          : 'heart'
        : Math.random() > 0.65
        ? 'heart'
        : 'circle';

      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.7,
        size: kind === 'heart' ? 7 + Math.random() * 8 : 4 + Math.random() * 6,
        alpha: 0.92,
        decay: 0.008 + Math.random() * 0.01,
        hue: paletteHues[Math.floor(Math.random() * paletteHues.length)],
        saturation: 76 + Math.random() * 18,
        lightness: 54 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        kind,
        ambient: false,
        phase: Math.random() * Math.PI * 2,
      });
    }
  };

  useEffect(() => {
    if (burstTrigger === 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    spawnBurst(w * 0.5, h * 0.44, celebratingRef.current ? 46 : 28, true);
  }, [burstTrigger]);

  useEffect(() => {
    if (clearTrigger === 0) return;
    particlesRef.current = particlesRef.current.filter((p) => p.ambient);
  }, [clearTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const makeAmbientParticle = (randomY = false): Particle => {
      const activeMode = modeRef.current;
      const hues = [340, 346, 333, 352, 326];
      const kind: Particle['kind'] =
        activeMode === 'hearts'
          ? Math.random() > 0.35
            ? 'heart'
            : 'circle'
          : activeMode === 'petals'
          ? Math.random() > 0.25
            ? 'petal'
            : 'circle'
          : Math.random() > 0.8
          ? 'heart'
          : 'circle';

      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 20 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.28 + Math.random() * 0.55),
        size:
          kind === 'heart'
            ? 5.5 + Math.random() * 7
            : kind === 'petal'
            ? 5 + Math.random() * 5.5
            : 2.2 + Math.random() * 3.5,
        alpha: 0.24 + Math.random() * 0.42,
        decay: 0,
        hue: hues[Math.floor(Math.random() * hues.length)],
        saturation: 72 + Math.random() * 20,
        lightness: 58 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        kind,
        ambient: true,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const seedAmbient = () => {
      const target =
        densityRef.current === 'lush'
          ? width < 640
            ? 44
            : 78
          : width < 640
          ? 24
          : 44;
      const nonAmbient = particlesRef.current.filter((p) => !p.ambient);
      const ambient: Particle[] = [];
      for (let i = 0; i < target; i++) {
        ambient.push(makeAmbientParticle(true));
      }
      particlesRef.current = [...ambient, ...nonAmbient];
    };

    seedAmbient();

    let lastTrailTime = 0;
    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (prefersReducedMotion) return;
      const now = performance.now();
      if (now - lastTrailTime < 26) return;
      lastTrailTime = now;

      const activeMode = modeRef.current;
      const kind: Particle['kind'] =
        activeMode === 'hearts'
          ? Math.random() > 0.4
            ? 'heart'
            : 'circle'
          : activeMode === 'petals'
          ? 'petal'
          : 'circle';

      particlesRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -0.5 - Math.random() * 0.9,
        size: kind === 'circle' ? 2.5 + Math.random() * 3.5 : 5 + Math.random() * 5,
        alpha: 0.72,
        decay: 0.016 + Math.random() * 0.012,
        hue: 338 + Math.random() * 18,
        saturation: 82,
        lightness: 58,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        kind,
        ambient: false,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, input, textarea, select')) {
        return;
      }
      if (!prefersReducedMotion) {
        spawnBurst(e.clientX, e.clientY, 16, modeRef.current === 'hearts');
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    let rafId = 0;
    let tick = 0;

    const renderFrame = () => {
      tick += 0.016;
      ctx.clearRect(0, 0, width, height);

      const targetAmbient =
        densityRef.current === 'lush'
          ? width < 640
            ? 44
            : 78
          : width < 640
          ? 24
          : 44;

      let ambientCount = 0;
      const nextParticles: Particle[] = [];

      // Keep total particles bounded for smooth 60fps
      if (particlesRef.current.length > 260) {
        particlesRef.current = particlesRef.current.slice(-260);
      }

      if (celebratingRef.current && !prefersReducedMotion && Math.random() < 0.24) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: height + 16,
          vx: (Math.random() - 0.5) * 1.4,
          vy: -(1.8 + Math.random() * 2.2),
          size: 7 + Math.random() * 8,
          alpha: 0.9,
          decay: 0.0055,
          hue: 336 + Math.random() * 20,
          saturation: 84,
          lightness: 55,
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          kind: 'heart',
          ambient: false,
          phase: Math.random() * Math.PI * 2,
        });
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        if (!prefersReducedMotion) {
          // Gentle organic sway
          p.x += p.vx + Math.sin(tick * 1.3 + p.phase) * 0.25;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Subtle pointer attraction/ripple
          if (pointerRef.current.active) {
            const dx = pointerRef.current.x - p.x;
            const dy = pointerRef.current.y - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 22500 && distSq > 400) {
              const dist = Math.sqrt(distSq);
              const pull = (1 - dist / 150) * 0.045;
              p.vx += (dx / dist) * pull;
              p.vy += (dy / dist) * pull;
            }
          }

          // Dampen excess horizontal velocity on ambient particles
          if (p.ambient) {
            p.vx *= 0.99;
            if (p.vy > -0.25) p.vy -= 0.01;
            if (p.vy < -1.1) p.vy += 0.015;
          } else {
            p.vx *= 0.982;
            p.vy *= 0.985;
            p.alpha -= p.decay;
          }
        }

        if (p.ambient) {
          ambientCount++;
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < -30) p.x = width + 20;
          if (p.x > width + 30) p.x = -20;
        }

        if (p.alpha <= 0.02) continue;

        const color = `hsl(${p.hue}, ${p.saturation}%, ${p.lightness}%)`;

        if (p.kind === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.rotation, color, p.alpha);
        } else if (p.kind === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, color, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        nextParticles.push(p);
      }

      while (ambientCount < targetAmbient) {
        nextParticles.push(makeAmbientParticle(false));
        ambientCount++;
      }

      particlesRef.current = nextParticles;
      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [mode, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
