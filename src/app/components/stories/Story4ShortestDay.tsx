import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Zap } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story4ShortestDay() {
  const { studentData } = useAppStore();

  const shortestDay = useMemo(() => {
    if (!studentData?.scud?.days) return null;

    let minSeconds = Infinity;
    let minDate = '';

    studentData.scud.days.forEach(day => {
      if (day.total_time_seconds > 0 && day.total_time_seconds < minSeconds) {
        minSeconds = day.total_time_seconds;
        minDate = day.date;
      }
    });

    if (minSeconds === Infinity) return null;

    const hours = Math.floor(minSeconds / 3600);
    const minutes = Math.floor((minSeconds % 3600) / 60);

    return {
      date: minDate,
      hours,
      minutes,
      totalSeconds: minSeconds
    };
  }, [studentData]);

  if (!shortestDay) return null;

  const dateObj = new Date(shortestDay.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('ru-RU', { month: 'long' });

  let message = "Зашёл, понял жизнь, вышел";
  let subMessage = "Краткость — сестра таланта";

  if (shortestDay.totalSeconds < 30 * 60) { // < 30 mins
     message = "Спидран по университету ⚡️";
     subMessage = "Новый рекорд?";
  } else if (shortestDay.totalSeconds > 4 * 60 * 60) { // > 4 hours
     message = "Даже самый короткий день был длинным";
     subMessage = "Усердие — твое второе имя";
  }

  return (
    <StoryCard gradient="from-orange-500 via-amber-500 to-yellow-400">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Zap className="w-12 h-12 md:w-[72px] md:h-[72px] mx-auto" fill="white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">Самый короткий визит</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="space-y-2 md:space-y-4"
        >
          <div className="text-4xl md:text-6xl">{day} {month}</div>
          <div className="flex justify-center items-baseline gap-2 md:gap-4">
             {shortestDay.hours > 0 && (
                <>
                  <div className="text-6xl md:text-8xl">{shortestDay.hours}</div>
                  <div className="text-3xl md:text-5xl">ч</div>
                </>
             )}
             <div className="text-6xl md:text-8xl">{shortestDay.minutes}</div>
             <div className="text-3xl md:text-5xl">мин</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2 md:space-y-4"
        >
          <p className="text-lg md:text-2xl italic">{message}</p>
          <p className="text-lg md:text-xl opacity-80">{subMessage}</p>
        </motion.div>

        {/* Quick timer animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-2"
        >
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
               className="w-3 h-3 bg-white rounded-full"
             />
           ))}
        </motion.div>
      </div>
    </StoryCard>
  );
}
