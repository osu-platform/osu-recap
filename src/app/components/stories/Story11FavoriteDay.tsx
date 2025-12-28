import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { CalendarDays, Clock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';

const WEEKDAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const WEEKDAYS_RU = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const FULL_NAMES_RU: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
};

export function Story11FavoriteDay({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const stats = useMemo(() => {
    if (!studentData?.scud?.days?.length) return null;

    const dayStats: Record<string, number> = {};
    WEEKDAYS_ORDER.forEach(d => dayStats[d] = 0);

    studentData.scud.days.forEach(day => {
      if (day.total_time_seconds > 0) {
        dayStats[day.weekday] += day.total_time_seconds;
      }
    });

    const maxTime = Math.max(...Object.values(dayStats));
    if (maxTime === 0) return null;

    const sortedDays = Object.entries(dayStats).sort((a, b) => b[1] - a[1]);
    const bestDay = sortedDays[0][0];
    
    const daysData = WEEKDAYS_ORDER.map((key, index) => ({
      id: key,
      name: WEEKDAYS_RU[index],
      value: dayStats[key],
      percent: dayStats[key] / maxTime,
      isBest: key === bestDay
    }));

    return {
      bestDayName: FULL_NAMES_RU[bestDay],
      days: daysData,
      totalHours: Math.round(dayStats[bestDay] / 3600)
    };
  }, [studentData]);

  useEffect(() => {
    if (!stats && onSkip) {
      onSkip();
    }
  }, [stats, onSkip]);

  if (!stats) return null;

  return (
    <StoryCard gradient="from-green-600 via-lime-500 to-yellow-500">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CalendarDays className="w-12 h-12 md:w-[72px] md:h-[72px] mx-auto text-white/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Твой самый активный день</h2>
        </motion.div>

        {/* Days of week circle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative inline-block"
        >
          <svg viewBox="0 0 320 320" className="w-64 h-64 md:w-[320px] md:h-[320px] mx-auto overflow-visible">
            {stats.days.map((day, i) => {
              const angle = (i * 360) / 7 - 90;
              const radius = 110;
              const x = 160 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 160 + radius * Math.sin((angle * Math.PI) / 180);
              
              // Scale circle based on activity relative to max
              const circleRadius = day.isBest ? 45 : 25 + (day.percent * 15);

              return (
                <motion.g key={day.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
                  {/* Connecting line to center (optional, maybe too cluttered) */}
                  <motion.line 
                    x1={160} y1={160} x2={x} y2={y} 
                    stroke="white" 
                    strokeWidth="1" 
                    strokeOpacity={0.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  />
                  
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={circleRadius}
                    fill={day.isBest ? 'white' : 'rgba(255,255,255,0.15)'}
                    stroke={day.isBest ? 'rgba(255,255,255,0.5)' : 'none'}
                    strokeWidth={4}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={day.isBest ? '#16a34a' : 'white'}
                    className={`${day.isBest ? 'text-2xl font-bold' : 'text-sm font-medium'}`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {day.name}
                  </text>
                </motion.g>
              );
            })}
            {/* Center info */}
            <foreignObject x="110" y="110" width="100" height="100">
              <div className="h-full flex items-center justify-center">
                 <Clock size={32} className="text-white/40" />
              </div>
            </foreignObject>
          </svg>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="space-y-2"
        >
          <div className="text-4xl md:text-6xl font-bold mb-2">{stats.bestDayName}</div>
          <p className="text-lg md:text-xl opacity-90">
            Суммарно ты провел в университете<br />
            <span className="font-bold text-xl md:text-2xl">{stats.totalHours} часов</span> именно в этот день
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-base md:text-lg italic opacity-75 pt-2 md:pt-4"
        >
          {stats.bestDayName} — день тяжелый? Или любимый? 🤔
        </motion.div>
      </div>
    </StoryCard>
  );
}
