import { useMemo } from 'react';
import { motion } from 'motion/react';

interface ParticleBackgroundProps {
  count?: number;
  emoji?: string[];
  color?: string;
  speed?: number;
}

export function ParticleBackground({ 
  count = 20, 
  emoji = ['✨', '⭐', '💫'], 
  color,
  speed = 3 
}: ParticleBackgroundProps) {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      char: emoji[Math.floor(Math.random() * emoji.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      driftX: (Math.random() - 0.5) * 100,
      driftY: (Math.random() - 0.5) * 100,
      duration: speed + Math.random() * 4,
      delay: Math.random() * 10,
      size: 0.8 + Math.random() * 1.2,
    }));
  }, [count, emoji.join(','), speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [0, p.driftY],
            x: [0, p.driftX],
            opacity: [0, 0.7, 0],
            scale: [0, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            color: color,
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}
