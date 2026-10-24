import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 35,
  size = 1.4,
  color = '#F59E0B',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const circles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      alpha: number;
      maxAlpha: number;
    }> = [];

    for (let i = 0; i < quantity; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.8 - 0.2, // Floats upward like garage welding embers
        size: Math.random() * size + 0.8,
        alpha: Math.random() * 0.6 + 0.1,
        maxAlpha: Math.random() * 0.8 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      circles.forEach((circle) => {
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Wrap around
        if (circle.y < 0) {
          circle.y = height;
          circle.x = Math.random() * width;
        }
        if (circle.x < 0) circle.x = width;
        if (circle.x > width) circle.x = 0;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = circle.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [quantity, size, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
    />
  );
};
