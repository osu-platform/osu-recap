import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Calendar } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story3LongestDay() {
  const { studentData } = useAppStore();

  const longestDay = useMemo(() => {
    if (!studentData?.scud?.days) return null;
    return [...studentData.scud.days].sort((a, b) => b.total_time_seconds - a.total_time_seconds)[0];
  }, [studentData]);

  if (!longestDay) return null;

  const dateObj = new Date(longestDay.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('ru-RU', { month: 'long' });
  
  const hours = Math.floor(longestDay.total_time_seconds / 3600);
  const minutes = Math.floor((longestDay.total_time_seconds % 3600) / 60);

  // Calculate start and end time for timeline
  const firstSession = longestDay.sessions[0];
  const lastSession = longestDay.sessions[longestDay.sessions.length - 1];
  
  const startTime = firstSession ? new Date(firstSession.entry_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '08:00';
  const endTime = lastSession ? new Date(lastSession.exit_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '17:00';

  return (
    <StoryCard gradient="from-yellow-500 via-orange-500 to-red-600">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        >
          <Calendar className="w-12 h-12 md:w-[72px] md:h-[72px] mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">Самый длинный день в ОГУ</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="space-y-2 md:space-y-4"
        >
          <div className="text-4xl md:text-6xl">{day} {month}</div>
          <div className="text-5xl md:text-7xl">{hours} ч {minutes} мин</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-2 md:space-y-3 text-lg md:text-xl opacity-90"
        >
          <p>Кажется, это был непростой день</p>
          <p className="text-base md:text-lg italic opacity-75">Университет тогда почти стал домом 🏛️</p>
        </motion.div>

        {/* Timeline visualization */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between text-sm mt-2 opacity-75">
            <span>{startTime}</span>
            <span>{endTime}</span>
          </div>
        </motion.div>
      </div>
    </StoryCard>
  );
}
