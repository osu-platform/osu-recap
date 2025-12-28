import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StoryCardProps {
  children: ReactNode;
  gradient?: string;
}

export function StoryCard({ children, gradient = 'from-orange-500 to-amber-600' }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center px-4 pt-14 pb-24 md:px-8 md:pt-20 md:pb-28 text-white relative overflow-hidden`}
    >
      {children}
    </motion.div>
  );
}
