import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { ParticleBackground } from '../ParticleBackground';
import { Calendar, Heart } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story0FirstDay() {
  const { studentData } = useAppStore();

  const firstDay = useMemo(() => {
    if (!studentData?.scud?.days?.length) return null;
    // Sort by date ascending
    const sorted = [...studentData.scud.days].sort((a, b) => a.date.localeCompare(b.date));
    // Find first day with visits
    return sorted.find(d => !d.no_visits && d.total_time_seconds > 0);
  }, [studentData]);

  if (!firstDay) return null; // Or loading state

  const dateObj = new Date(firstDay.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('ru-RU', { month: 'long' });
  const year = dateObj.getFullYear();

  // Find first entry time
  const firstSession = firstDay.sessions[0];
  const entryTime = firstSession ? new Date(firstSession.entry_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  const hours = Math.floor(firstDay.total_time_seconds / 3600);
  const minutes = Math.floor((firstDay.total_time_seconds % 3600) / 60);

  return (
    <StoryCard gradient="from-amber-500 via-orange-400 to-red-400">
      {/* Sparkles animation */}
      <ParticleBackground count={25} emoji={['✨', '💫', '⭐']} speed={4} />

      <div className="text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-4">
            <Calendar className="w-12 h-12 md:w-[72px] md:h-[72px]" />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart fill="white" className="w-8 h-8 md:w-12 md:h-12 absolute -top-2 -right-2" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="z-10"
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">Помнишь первый день?</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="z-10 space-y-4 md:space-y-6"
        >
          <motion.div 
            className="text-5xl md:text-7xl"
            animate={{
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {day} {month}
          </motion.div>
          <div className="text-xl md:text-3xl opacity-90">{year}</div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 md:p-8 inline-block mt-4 md:mt-6">
            <p className="text-lg md:text-2xl mb-2 md:mb-4">Ты пришёл в</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="text-5xl"
            >
              {entryTime}
            </motion.div>
            <p className="text-xl mt-4 opacity-80">Волнение? Да. Но ты справился! 💪</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="z-10 space-y-3"
        >
          <p className="text-2xl">Провёл в университете</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.7, type: 'spring' }}
            className="text-6xl"
          >
            {hours} ч {minutes} мин
          </motion.div>
          <p className="text-xl opacity-80 italic mt-4">
            {studentData?.student?.course === 1 
              ? "Это был первый шаг в новую жизнь 🚀"
              : "С возвращением в родные стены! 🎓"}
          </p>
        </motion.div>

      </div>
    </StoryCard>
  );
}