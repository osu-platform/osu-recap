import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Sunrise, Coffee } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story3_5EarliestMorning() {
  const { studentData } = useAppStore();

  const earliestEntry = useMemo(() => {
    if (!studentData?.scud?.days) return null;

    let earliestTime = 24 * 60; // Minutes from midnight
    let earliestDate = '';
    let earliestTimeString = '';

    studentData.scud.days.forEach(day => {
      if (day.sessions.length === 0) return;
      
      // Find first entry of the day
      const firstSession = day.sessions[0];
      const entryDate = new Date(firstSession.entry_time);
      const minutesFromMidnight = entryDate.getHours() * 60 + entryDate.getMinutes();

      if (minutesFromMidnight < earliestTime) {
        earliestTime = minutesFromMidnight;
        earliestDate = day.date;
        earliestTimeString = entryDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      }
    });

    if (earliestTime === 24 * 60) return null;

    return {
      date: earliestDate,
      time: earliestTimeString,
      minutesFromMidnight: earliestTime
    };
  }, [studentData]);

  if (!earliestEntry) return null;

  const dateObj = new Date(earliestEntry.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('ru-RU', { month: 'long' });

  // Determine message based on time
  let title = "Самое раннее утро";
  let message = "Ты встал раньше солнца 🌅";
  let subMessage = "Настоящий чемпион силы воли!";
  let badge = "🏆 Ранняя пташка";

  if (earliestEntry.minutesFromMidnight > 8 * 60) { // After 8:00
    title = "Самое раннее утро";
    message = "Не слишком рано, но вовремя ⏰";
    subMessage = "Главное — выспаться!";
    badge = "🦉 Сова-стратег";
  } else if (earliestEntry.minutesFromMidnight > 7 * 60 + 45) { // 7:45 - 8:00
    message = "Бодрое утро! 🏃‍♂️";
    subMessage = "Отличное начало дня";
  }

  return (
    <StoryCard gradient="from-pink-400 via-rose-400 to-orange-400">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative"
        >
          <Sunrise className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
          <motion.div
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl md:text-4xl"
          >
            ☀️
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">{title}</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="space-y-4 md:space-y-6"
        >
          <p className="text-2xl">{day} {month}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-10 inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
              className="text-8xl mb-4"
            >
              {earliestEntry.time}
            </motion.div>
            <p className="text-2xl opacity-90">утра</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-4"
        >
          <p className="text-2xl">{message}</p>
          <p className="text-xl opacity-80 italic">
            {subMessage}
          </p>
        </motion.div>

        {/* Coffee animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="flex justify-center items-center gap-4"
        >
          <Coffee size={48} />
          <motion.div
            animate={{
              y: [-3, -8, -3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-3xl opacity-70"
          >
            ☕
          </motion.div>
          <motion.div
            animate={{
              y: [-5, -10, -5],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            className="absolute text-lg"
          >
            ☁️
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-xl opacity-75 pt-4"
        >
          Надеемся, кофе был крепким 💪
        </motion.div>

        {/* Achievement badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, type: 'spring' }}
        >
          <div className="inline-block px-6 py-3 bg-yellow-400/30 border-2 border-white rounded-full">
            <span className="text-2xl">{badge}</span>
          </div>
        </motion.div>
      </div>
    </StoryCard>
  );
}
