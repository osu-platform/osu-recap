import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story2TotalTime() {
  const { studentData } = useAppStore();

  const { totalHours, totalMinutes, daysCount } = useMemo(() => {
    if (!studentData?.scud?.days) return { totalHours: 0, totalMinutes: 0, daysCount: 0 };
    
    const totalSeconds = studentData.scud.days.reduce((acc, day) => acc + day.total_time_seconds, 0);
    const daysCount = studentData.scud.days.filter(d => d.total_time_seconds > 0).length;
    
    return {
      totalHours: Math.floor(totalSeconds / 3600),
      totalMinutes: Math.floor((totalSeconds % 3600) / 60),
      daysCount
    };
  }, [studentData]);

  const fullDays = Math.floor(totalHours / 24);

  return (
    <StoryCard gradient="from-orange-600 via-amber-600 to-yellow-500">
      <div className="text-center space-y-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block"
        >
          <Clock size={64} className="mx-auto mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl mb-4">За этот семестр ты провёл в университете</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <div className="text-8xl mb-4">{totalHours}</div>
          <div className="text-5xl mb-2">часов {totalMinutes} минут</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl opacity-80"
        >
          Это ~{fullDays} полных суток твоей жизни
        </motion.div>

        {/* Animated circle progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-4"
        >
          <svg width="200" height="200" className="mx-auto">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={502}
              initial={{ strokeDashoffset: 502 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 1.4, duration: 1.5, ease: 'easeOut' }}
              transform="rotate(-90 100 100)"
            />
          </svg>
        </motion.div>
      </div>
    </StoryCard>
  );
}
