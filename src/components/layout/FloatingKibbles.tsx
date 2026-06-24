"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface BurstKibble {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRotation: number;
  life: number;
}

type CanvasWithBurst = HTMLCanvasElement & { _burst?: BurstKibble[] };

const kibbleColors = [
  "#7a3f17",
  "#9f5b22",
  "#c27a2c",
  "#d59a3a",
  "#f0b84b",
  "#6f3a12",
];

export default function FloatingKibbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const pathname = usePathname();

  const isLanding = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isActive = isLanding || isDashboard;

  const spawnBurst = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const burstObjects = (canvas as CanvasWithBurst)._burst ?? [];

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
      const speed = Math.random() * 3.8 + 2.1;
      burstObjects.push({
        x,
        y,
        size: Math.random() * 4.5 + 3.5,
        color: kibbleColors[Math.floor(Math.random() * kibbleColors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.4,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.16,
        life: 1,
      });
    }

    (canvas as CanvasWithBurst)._burst = burstObjects;
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    interface DriftObject {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      vRotation: number;
      type: "kibble" | "paw" | "cluster";
      wobble: number;
      depth: number;
    }

    interface PawTrail {
      x: number;
      y: number;
      size: number;
      opacity: number;
      rotation: number;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const objects: DriftObject[] = [];
    const count = isLanding ? 46 : 34;

    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      const typeRoll = Math.random();
      objects.push({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        size: Math.random() * 5.5 + 3.5 + depth * 3,
        color: kibbleColors[Math.floor(Math.random() * kibbleColors.length)],
        vx: (Math.random() - 0.5) * (0.18 + depth * 0.55),
        vy: Math.random() * (0.18 + depth * 0.34) + 0.08,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * (0.012 + depth * 0.028),
        type: typeRoll > 0.9 ? "paw" : typeRoll > 0.78 ? "cluster" : "kibble",
        wobble: Math.random() * Math.PI * 2,
        depth,
      });
    }

    const pawTrails: PawTrail[] = [];
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 46) {
        pawTrails.push({
          x: e.clientX,
          y: e.clientY,
          size: 7 + Math.random() * 3,
          opacity: theme === "dark" ? 0.24 : 0.18,
          rotation: Math.atan2(dy, dx) + Math.PI / 2,
        });
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      spawnBurst(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const drawPaw = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      context.ellipse(0, 2, size * 0.8, size * 0.58, 0, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.ellipse(-size * 0.72, -size * 0.32, size * 0.28, size * 0.38, -0.4, 0, Math.PI * 2);
      context.ellipse(-size * 0.24, -size * 0.72, size * 0.28, size * 0.38, -0.15, 0, Math.PI * 2);
      context.ellipse(size * 0.24, -size * 0.72, size * 0.28, size * 0.38, 0.15, 0, Math.PI * 2);
      context.ellipse(size * 0.72, -size * 0.32, size * 0.28, size * 0.38, 0.4, 0, Math.PI * 2);
      context.fill();
    };

    const drawKibble = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      context.ellipse(0, 0, size * 1.28, size * 0.78, 0, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha *= 0.35;
      context.fillStyle = "#fff0c2";
      context.beginPath();
      context.ellipse(size * 0.28, -size * 0.2, size * 0.28, size * 0.14, 0.5, 0, Math.PI * 2);
      context.fill();
    };

    const drawCluster = (context: CanvasRenderingContext2D, size: number) => {
      for (let i = 0; i < 3; i++) {
        context.save();
        context.translate(Math.cos(i * 2.1) * size * 0.55, Math.sin(i * 2.1) * size * 0.35);
        context.rotate(i * 0.65);
        drawKibble(context, size * (0.5 + i * 0.08));
        context.restore();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      ctx.globalCompositeOperation = theme === "dark" ? "screen" : "multiply";

      const baseOpacity = isLanding
        ? theme === "dark"
          ? 0.24
          : 0.18
        : theme === "dark"
          ? 0.2
          : 0.14;
      const time = Date.now() * 0.001;

      for (let i = pawTrails.length - 1; i >= 0; i--) {
        const p = pawTrails[i];
        p.opacity -= 0.004;
        if (p.opacity <= 0) {
          pawTrails.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = theme === "dark" ? "#34d399" : "#059669";
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = theme === "dark" ? 12 : 4;
        ctx.shadowColor = theme === "dark" ? "rgba(52, 211, 153, 0.4)" : "rgba(5, 150, 105, 0.2)";
        drawPaw(ctx, p.size);
        ctx.restore();
      }

      objects.forEach((obj) => {
        obj.wobble += 0.016 + obj.depth * 0.012;
        obj.x += obj.vx + Math.sin(obj.wobble) * (0.08 + obj.depth * 0.16);
        obj.y += obj.vy;
        obj.rotation += obj.vRotation;

        if (obj.y > viewportHeight + 30) {
          obj.y = -30;
          obj.x = Math.random() * viewportWidth;
        }
        if (obj.x < -30) obj.x = viewportWidth + 30;
        if (obj.x > viewportWidth + 30) obj.x = -30;

        const breathe = 1 + Math.sin(time * 1.8 + obj.wobble) * (0.05 + obj.depth * 0.05);
        const alpha = baseOpacity * (0.55 + obj.depth * 0.7);

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation);
        ctx.scale(breathe, breathe);
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = obj.type === "paw" ? 10 : 7;
        ctx.shadowColor = obj.type === "paw" ? "rgba(16,185,129,0.28)" : "rgba(217,119,6,0.32)";

        if (obj.type === "paw") {
          ctx.fillStyle = theme === "dark" ? "#34d399" : "#047857";
          drawPaw(ctx, obj.size);
        } else if (obj.type === "cluster") {
          ctx.fillStyle = obj.color;
          drawCluster(ctx, obj.size);
        } else {
          ctx.fillStyle = obj.color;
          drawKibble(ctx, obj.size);
        }

        ctx.restore();
      });

      const burst = (canvas as CanvasWithBurst)._burst ?? [];
      for (let i = burst.length - 1; i >= 0; i--) {
        const b = burst[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.075;
        b.rotation += b.vRotation;
        b.life -= 0.017;

        if (b.life <= 0) {
          burst.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.life * (theme === "dark" ? 0.72 : 0.58);
        ctx.shadowBlur = 14 * b.life;
        ctx.shadowColor = "rgba(245, 158, 11, 0.45)";
        drawKibble(ctx, b.size);
        ctx.restore();
      }
      (canvas as CanvasWithBurst)._burst = burst;

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [theme, isActive, isLanding, spawnBurst]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[3] bg-transparent"
      aria-hidden="true"
    />
  );
}
