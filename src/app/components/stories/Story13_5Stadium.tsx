import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Dumbbell, Trophy, MapPin, Activity } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';
import { StudentData } from '@/types/student';

export const SPORT_LOCATIONS = [
  'ФОЗ-спортзал',
  '3-111а',
  'Общ.№7-011',
  'Ст. "Прогресс"'
];

export const getSportStats = (data: StudentData | null) => {
  if (!data?.attendance?.days) return null;

  let scheduledDays = 0;
  let attendedDays = 0;
  let totalSeconds = 0;
  const locationCounts: Record<string, number> = {};

  data.attendance.days.forEach(day => {
    // Find sport classes for this day
    const sportClasses = day.classes.filter(cls => {
        const room = cls.room || '';
        return SPORT_LOCATIONS.some(loc => room.includes(loc));
    });

    if (sportClasses.length > 0) {
        scheduledDays++;
        
        // Check if attended ANY of the sport classes that day
        const attended = sportClasses.some(cls => 
            cls.attendance.status === 'present' || cls.attendance.status === 'partial'
        );

        if (attended) {
            attendedDays++;
            
            // Count locations and time
            sportClasses.forEach(cls => {
                 if (cls.attendance.status === 'present' || cls.attendance.status === 'partial') {
                    totalSeconds += cls.attendance.presence_time_seconds;
                    const room = cls.room || '';
                    const loc = SPORT_LOCATIONS.find(l => room.includes(l)) || room;
                    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
                 }
            });
        }
    }
  });

  if (scheduledDays === 0) return null;

  return {
    scheduledDays,
    attendedDays,
    totalSeconds,
    percentage: attendedDays / scheduledDays,
    locationCounts
  };
};

export function Story13_5Stadium({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const stats = useMemo(() => getSportStats(studentData), [studentData]);

  useEffect(() => {
    if (!stats || stats.attendedDays === 0) {
      onSkip?.();
    }
  }, [stats, onSkip]);

  if (!stats) return null;

  const { attendedDays, percentage, locationCounts, totalSeconds } = stats;

  const favoriteLocationKey = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    
  let displayLocation = 'Спортзал';
  if (favoriteLocationKey.includes('Ст. "Прогресс"')) displayLocation = 'Стадион "Прогресс"';
  else if (favoriteLocationKey.includes('ФОЗ')) displayLocation = 'ФОЗ';
  else if (favoriteLocationKey.includes('Общ.№7-011')) displayLocation = 'Тренажерка (Общ. 7)';
  else if (favoriteLocationKey.includes('3-111а')) displayLocation = 'Зал в 3-м корпусе';

  let title = "Любитель спорта";
  let description = "Ходишь на физру, и это главное.";
  let emoji = "🏃";
  
  if (percentage > 0.8) {
      title = "Олимпийский резерв";
      description = "Почти идеальная посещаемость! Тренер гордится тобой.";
      emoji = "🥇";
  } else if (percentage > 0.4) {
      title = "Спортсмен";
      description = "Регулярные тренировки приносят результат.";
      emoji = "💪";
  }

  return (
    <StoryCard gradient="from-emerald-600 via-green-600 to-teal-600">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl w-full px-4">
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Dumbbell className="w-16 h-16 md:w-20 md:h-20 mx-auto text-white/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{title} {emoji}</h2>
          <p className="text-lg md:text-xl opacity-80">{description}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10"
        >
          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-6">
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-1">{attendedDays}</div>
              <div className="text-sm opacity-70">тренировок</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-1">{(totalSeconds / 3600).toFixed(1)}</div>
              <div className="text-sm opacity-70">часов спорта</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-center gap-2 mb-2 opacity-60 text-sm uppercase tracking-wider">
              <MapPin size={14} />
              <span>Основная локация</span>
            </div>
            <p className="text-lg md:text-2xl font-bold leading-tight">{displayLocation}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <div className="text-4xl md:text-6xl mb-2">{emoji}</div>
          <h3 className="text-lg md:text-2xl font-bold">{title}</h3>
          <p className="text-base md:text-lg opacity-75 italic">{description}</p>
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="absolute bottom-24 right-8 opacity-20"
        >
          <Trophy className="w-20 h-20 md:w-[120px] md:h-[120px]" />
        </motion.div>
      </div>
    </StoryCard>
  );
}
