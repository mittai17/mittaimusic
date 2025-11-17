import { useEffect, useRef } from 'react';
import styles from '../styles/CircularPlayer.module.css';

interface CircularPlayerProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function CircularPlayer({
  progress,
  size = 320,
  strokeWidth = 8,
  children,
}: CircularPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Draw progress arc
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + progress * 2 * Math.PI
    );
    ctx.strokeStyle = '#1db954';
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [progress, size, strokeWidth]);

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={styles.canvas}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
