import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Hourglass, Timer, History } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';

export function Story9_5PartialAttendance({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const partialStats = useMemo(() => {
    if (!studentData?.attendance?.days) return null;

    const subjectStats: Record<string, { count: number; totalSeconds: number; expectedSeconds: number }> = {};
    let totalPartials = 0;

    studentData.attendance.days.forEach(day => {
      day.classes.forEach(cls => {
        if (cls.attendance.status === 'partial') {
          // Normalize subject name
          const name = cls.subject.replace(/\s*\((лк|пз|лаб|экз|зач|конс|пр)\)\s*$/i, '').trim();
          
          // Calculate expected duration
          const [startH, startM] = cls.time_start.split(':').map(Number);
          const [endH, endM] = cls.time_end.split(':').map(Number);
          const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
          const durationSeconds = durationMinutes * 60;

          if (!subjectStats[name]) {
            subjectStats[name] = { count: 0, totalSeconds: 0, expectedSeconds: 0 };
          }
          
          subjectStats[name].count++;
          subjectStats[name].totalSeconds += cls.attendance.presence_time_seconds;
          subjectStats[name].expectedSeconds += durationSeconds;
          totalPartials++;
        }
      });
    });

    if (totalPartials === 0) return null;

    // Find the subject with the most partial attendances
    const topSubject = Object.entries(subjectStats)
      .sort((a, b) => b[1].count - a[1].count)[0];

    if (!topSubject) return null;

    const [name, stats] = topSubject;
    const avgPercent = Math.round((stats.totalSeconds / stats.expectedSeconds) * 100);
    const avgMinutes = Math.round((stats.totalSeconds / stats.count) / 60);

    return {
      name,
      count: stats.count,
      avgPercent,
      avgMinutes
    };
  }, [studentData]);

  useEffect(() => {
    if (!partialStats && onSkip) {
      onSkip();
    }
  }, [partialStats, onSkip]);

  if (!partialStats) return null;

  return (
    <StoryCard gradient="from-cyan-500 via-teal-500 to-emerald-600">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl w-full px-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 180 }}
          transition={{ delay: 0.3, duration: 1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        >
          <Hourglass className="w-12 h-12 md:w-[72px] md:h-[72px] mx-auto text-white/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Мастер тайм-менеджмента</h2>
          <p className="text-lg md:text-xl opacity-90">Ты точно знаешь, сколько нужно быть на паре</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="space-y-4 md:space-y-6"
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 md:p-8 inline-block w-full max-w-md">
            <p className="text-base md:text-lg opacity-80 mb-2">Чаще всего ты «оптимизировал»</p>
            <p className="text-xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">{partialStats.name}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl md:text-4xl font-bold">{partialStats.count}</div>
                <div className="text-sm opacity-80">раз(а)</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl md:text-4xl font-bold">{partialStats.avgPercent}%</div>
                <div className="text-sm opacity-80">времени</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-3 opacity-90"
        >
          <Timer className="w-5 h-5 md:w-6 md:h-6" />
          <p className="text-lg md:text-xl">В среднем по {partialStats.avgMinutes} мин.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-base md:text-lg italic opacity-75 pt-4"
        >
          «Главное — отметиться!» 😉
        </motion.div>
      </div>
    </StoryCard>
  );
}
