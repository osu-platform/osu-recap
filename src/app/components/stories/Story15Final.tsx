import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { ParticleBackground } from '../ParticleBackground';
import { Sparkles, Download, Share2, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story15Final() {
  const { studentData } = useAppStore();

  const stats = useMemo(() => {
    if (!studentData) return null;

    // Total time
    const totalSeconds = studentData.scud.days.reduce((acc, day) => acc + day.total_time_seconds, 0);
    const totalHours = Math.round(totalSeconds / 3600);

    // Attendance percentage
    let totalClasses = 0;
    let attendedClasses = 0;
    const subjectGroups = new Map<string, { count: number; subgroups: Set<string> }>();

    studentData.attendance.days.forEach(day => {
      day.classes.forEach(cls => {
        // Count attended classes (numerator)
        if (cls.attendance.status === 'present') {
          attendedClasses++;
        } else if (cls.attendance.status === 'partial') {
          attendedClasses += 0.5;
        }

        // Group for total classes calculation (denominator)
        const key = `${cls.subject}|${cls.type}`;
        if (!subjectGroups.has(key)) {
          subjectGroups.set(key, { count: 0, subgroups: new Set() });
        }
        
        const group = subjectGroups.get(key)!;
        group.count++;
        if (cls.subgroup) {
            group.subgroups.add(cls.subgroup);
        }
      });
    });

    // Calculate total classes by normalizing based on subgroup count
    subjectGroups.forEach((group) => {
      const subgroupCount = group.subgroups.size || 1;
      totalClasses += group.count / subgroupCount;
    });

    const attendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // Average grade
    const avgGrade = studentData.progress?.averageGrade || 0;

    return [
      { value: `${totalHours}ч`, label: 'в университете' },
      { value: `${attendancePercent}%`, label: 'посещаемость' },
      { value: avgGrade > 0 ? avgGrade.toFixed(1) : '-', label: 'средний балл' },
    ];
  }, [studentData]);

  return (
    <StoryCard gradient="from-indigo-700 via-blue-700 to-cyan-600">
      {/* Snowflakes animation */}
      <ParticleBackground count={25} emoji={['❄️', '⛄', '✨']} speed={8} />

      <div className="z-10 text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <Sparkles className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 md:space-y-6"
        >
          <h1 className="text-3xl md:text-5xl mb-2 md:mb-4">Это был твой семестр</h1>
          <h1 className="text-4xl md:text-6xl mb-4 md:mb-6">в ОГУ</h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="text-5xl md:text-7xl my-4 md:my-8"
        >
          🚀
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="space-y-4"
        >
          <p className="text-2xl md:text-4xl mb-4">Дальше — больше</p>
        </motion.div>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto my-4 md:my-8"
        >
          {stats?.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.15, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 cursor-pointer"
            >
              <div className="text-xl md:text-3xl mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-4 md:pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
            <span>Поделиться</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 md:px-6 md:py-4 rounded-full border border-white/50 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            <span>Пересмотреть</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="pt-4 md:pt-8 text-base md:text-lg opacity-70"
        >
          С Новым годом! 🎄✨
        </motion.div>
      </div>
    </StoryCard>
  );
}