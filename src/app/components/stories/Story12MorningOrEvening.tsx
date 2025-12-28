import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';

export function Story12MorningOrEvening({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const stats = useMemo(() => {
    if (!studentData?.scud?.days?.length) return null;

    const arrivalHours: number[] = [];
    const hourlyDistribution = new Array(24).fill(0);
    
    studentData.scud.days.forEach(day => {
      if (day.sessions.length > 0) {
        // Consider the FIRST entry of the day
        const firstSession = day.sessions[0];
        
        let h: number, m: number;
        
        // Try parsing as ISO date string first (e.g. "2023-09-01T08:30:00")
        const date = new Date(firstSession.entry_time);
        if (!isNaN(date.getTime())) {
          h = date.getHours();
          m = date.getMinutes();
        } else {
          // Fallback to "HH:MM" or "HH:MM:SS" parsing
          const parts = firstSession.entry_time.split(':').map(Number);
          if (parts.length >= 2 && !parts.some(isNaN)) {
            h = parts[0];
            m = parts[1];
          } else {
            return; // Skip invalid format
          }
        }

        const time = h + m / 60;
        arrivalHours.push(time);
        hourlyDistribution[h]++;
      }
    });

    if (arrivalHours.length === 0) return null;

    // Calculate median arrival time
    arrivalHours.sort((a, b) => a - b);
    const mid = Math.floor(arrivalHours.length / 2);
    const medianTimeVal = arrivalHours.length % 2 !== 0 
      ? arrivalHours[mid] 
      : (arrivalHours[mid - 1] + arrivalHours[mid]) / 2;

    // Format time correctly handling minute overflow
    const totalMinutes = Math.round(medianTimeVal * 60);
    const avgH = Math.floor(totalMinutes / 60);
    const avgM = totalMinutes % 60;
    const avgTimeStr = `${avgH}:${avgM.toString().padStart(2, '0')}`;

    const morningArrivals = arrivalHours.filter(h => h < 12).length;
    const eveningArrivals = arrivalHours.filter(h => h >= 12).length;
    const total = arrivalHours.length;
    
    const isMorning = morningArrivals >= eveningArrivals;
    const percent = Math.round((isMorning ? morningArrivals : eveningArrivals) / total * 100);

    // Histogram data (dynamic crop)
    let startHour = 0;
    let endHour = 23;

    // Find first active hour
    for (let h = 0; h < 24; h++) {
      if (hourlyDistribution[h] > 0) {
        startHour = h;
        break;
      }
    }
    // Find last active hour
    for (let h = 23; h >= 0; h--) {
      if (hourlyDistribution[h] > 0) {
        endHour = h;
        break;
      }
    }

    const histogramRaw = hourlyDistribution.slice(startHour, endHour + 1);
    const maxCount = Math.max(...histogramRaw);
    
    const histogram = histogramRaw.map((count, i) => ({
      hour: startHour + i,
      height: maxCount > 0 ? (count / maxCount) * 100 : 0,
      isMedian: Math.floor(medianTimeVal) === (startHour + i)
    }));

    return {
      isMorning,
      avgTimeStr,
      percent,
      histogram,
      title: isMorning ? "Ранняя пташка" : "Ночной житель",
      subtitle: isMorning ? "Твой день начинается с первыми лучами" : "Твоя энергия просыпается к обеду",
      gradient: isMorning 
        ? "from-orange-400 via-amber-500 to-yellow-500" 
        : "from-indigo-900 via-purple-900 to-slate-900"
    };
  }, [studentData]);

  useEffect(() => {
    if (!stats && onSkip) {
      onSkip();
    }
  }, [stats, onSkip]);

  if (!stats) return null;

  return (
    <StoryCard gradient={stats.gradient}>
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl w-full px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-8 md:gap-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ 
              scale: stats.isMorning ? 1.2 : 0.8, 
              opacity: stats.isMorning ? 1 : 0.5,
              filter: stats.isMorning ? 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.5))' : 'none'
            }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <Sun className={`text-yellow-100 ${stats.isMorning ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12 md:w-16 md:h-16'}`} />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-2xl md:text-4xl font-bold opacity-80"
          >
            VS
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ 
              scale: !stats.isMorning ? 1.2 : 0.8, 
              opacity: !stats.isMorning ? 1 : 0.5,
              filter: !stats.isMorning ? 'drop-shadow(0 0 20px rgba(200, 200, 255, 0.5))' : 'none'
            }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <Moon className={`text-blue-100 ${!stats.isMorning ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12 md:w-16 md:h-16'}`} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{stats.title}</h2>
          <p className="text-lg md:text-xl opacity-90">{stats.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 150 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 inline-block border border-white/10">
            <p className="text-lg md:text-2xl mb-2 opacity-90">Обычно ты в универе к</p>
            <p className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{stats.avgTimeStr}</p>
            <div className="flex items-center justify-center gap-2 opacity-80">
              {stats.isMorning ? <Sunrise className="w-4 h-4 md:w-5 md:h-5" /> : <Sunset className="w-4 h-4 md:w-5 md:h-5" />}
              <span className="text-base md:text-lg">{stats.percent}% приходов {stats.isMorning ? 'утром' : 'днем'}</span>
            </div>
          </div>
        </motion.div>

        {/* Time visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pt-4 md:pt-8 w-full max-w-md mx-auto"
        >
          <div className="flex justify-between gap-1 h-24 md:h-32 px-4">
            {stats.histogram.map((bar, i) => (
              <div key={bar.hour} className="flex flex-col items-center flex-1 h-full group relative">
                <div className="flex-1 w-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(bar.height, 5)}%` }}
                    transition={{ delay: 1.8 + i * 0.05, type: 'spring', damping: 15 }}
                    className={`w-full rounded-t-md transition-colors ${
                      bar.isMedian ? 'bg-white' : 'bg-white/40 group-hover:bg-white/60'
                    }`}
                  />
                </div>
                <span className="text-[8px] md:text-[10px] opacity-60 mt-1">{bar.hour}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs opacity-50 mt-2">Время прихода (часы)</div>
        </motion.div>
      </div>
    </StoryCard>
  );
}
