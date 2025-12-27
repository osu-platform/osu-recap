import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Clock, Zap, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';

export function Story10Tardiness({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const stats = useMemo(() => {
    if (!studentData?.attendance?.days) return null;

    const subjectStats: Record<string, { count: number; totalSeconds: number; expectedSeconds: number }> = {};
    let totalPartials = 0;

    studentData.attendance.days.forEach(day => {
      day.classes.forEach(cls => {
        const [startH, startM] = cls.time_start.split(':').map(Number);
        const [endH, endM] = cls.time_end.split(':').map(Number);
        const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        const durationSeconds = durationMinutes * 60;

        // Consider it a "partial" attendance if:
        // 1. Status is explicitly 'partial'
        // 2. Status is 'present' but presence time is significantly less than duration (> 10 mins difference)
        // We use 10 mins (600s) tolerance to account for breaks/delays
        const isPartial = cls.attendance.status === 'partial' || 
                         (cls.attendance.status === 'present' && 
                          cls.attendance.presence_time_seconds > 0 && 
                          cls.attendance.presence_time_seconds < durationSeconds - 600);

        if (isPartial) {
          const name = cls.subject.replace(/\s*\((лк|пз|лаб|экз|зач|конс|пр|диф.зач)\)\s*$/i, '').trim();
          
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

    if (totalPartials === 0) {
      return {
        totalPartials: 0,
        topSubject: "Всё идеально",
        topSubjectCount: 0,
        avgPercent: 100,
        title: "Мистер Пунктуальность",
        description: "Твоей дисциплине можно позавидовать."
      };
    }

    const topSubject = Object.entries(subjectStats)
      .sort((a, b) => b[1].count - a[1].count)[0];

    if (!topSubject) return null;

    const [name, s] = topSubject;
    const avgPercent = Math.round((s.totalSeconds / s.expectedSeconds) * 100);
    
    // Determine "Efficiency Title"
    let title = "Мастер оптимизации";
    let description = "Чуть-чуть не считается!";
    if (avgPercent < 30) {
      title = "Призрак аудиторий";
      description = "Зашел, отметился, ушел. Профи.";
    } else if (avgPercent < 60) {
      title = "Ценитель времени";
      description = "Успеваешь всё самое важное за полпары.";
    } else if (avgPercent < 90) {
      title = "Почти вовремя";
      description = "Идеальный баланс учебы и жизни.";
    }

    return {
      totalPartials,
      topSubject: name,
      topSubjectCount: s.count,
      avgPercent,
      title,
      description
    };
  }, [studentData]);

  useEffect(() => {
    if (!stats && onSkip) {
      onSkip();
    }
  }, [stats, onSkip]);

  if (!stats) return null;

  return (
    <StoryCard gradient="from-violet-600 via-purple-600 to-fuchsia-600">
      <div className="text-center space-y-6 max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <div className="relative inline-block">
            <Clock size={80} className="text-white/90" />
            <motion.div 
              className="absolute -bottom-2 -right-2 bg-yellow-400 text-black rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Zap size={24} fill="currentColor" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-2">Твой стиль: {stats.title}</h2>
          <p className="text-xl opacity-80">{stats.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-5xl font-bold mb-1">{stats.totalPartials}</div>
              <div className="text-sm opacity-70 leading-tight">пар с неполным<br/>присутствием</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-1">{stats.avgPercent}%</div>
              <div className="text-sm opacity-70 leading-tight">среднее время<br/>на этих парах</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-sm opacity-60 mb-2 uppercase tracking-wider">Дисциплина для экономии времени</p>
            <p className="text-2xl font-bold leading-tight">{stats.topSubject}</p>
            <p className="text-sm opacity-60 mt-1">({stats.topSubjectCount} раз)</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-2 opacity-70 text-sm"
        >
          <TrendingUp size={16} />
          <span>Время — самый ценный ресурс!</span>
        </motion.div>
      </div>
    </StoryCard>
  );
}
