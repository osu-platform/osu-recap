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
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 50;
        const startY = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            initial={{
              x: `${startX}%`,
              y: `${startY}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
              x: [`${startX}%`, `${endX}%`],
            }}
            transition={{
              duration: speed + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              fontSize: `${1 + Math.random()}rem`,
              color: color,
            }}
          >
            {randomEmoji}
          </motion.div>
        );
      })}
    </div>
  );
}
