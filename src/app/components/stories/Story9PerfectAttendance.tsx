import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { ParticleBackground } from '../ParticleBackground';
import { Award, Star, ThumbsUp } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo, useEffect } from 'react';

export function Story9PerfectAttendance({ onSkip }: { onSkip?: () => void }) {
  const { studentData } = useAppStore();

  const stats = useMemo(() => {
    if (!studentData?.attendance?.days) return null;

    const subjectStats: Record<string, { total: number; attended: number; name: string }> = {};

    studentData.attendance.days.forEach(day => {
      day.classes.forEach(cls => {
        // Normalize subject name by removing type in parentheses (e.g. "(лк)", "(пз)")
        const name = cls.subject.replace(/\s*\((лк|пз|лб|экз|зач|конс|пр|диф.зач)\)\s*$/i, '').trim();
        
        if (!subjectStats[name]) {
          subjectStats[name] = { total: 0, attended: 0, name };
        }
        subjectStats[name].total++;
        if (cls.attendance.status === 'present') {
          subjectStats[name].attended += 1;
        } else if (cls.attendance.status === 'partial') {
          subjectStats[name].attended += 0.5;
        }
      });
    });

    const qualifiedSubjects = Object.values(subjectStats)
      .filter(s => s.total >= 3) // Minimum 3 classes to count
      .map(s => ({
        ...s,
        percentage: Math.round((s.attended / s.total) * 100)
      }))
      .filter(s => s.percentage >= 75)
      .sort((a, b) => {
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        return b.total - a.total;
      })
      .slice(0, 3);

    if (qualifiedSubjects.length === 0) return null;

    const best = qualifiedSubjects[0];
    let tier: 'perfect' | 'excellent' | 'good' = 'good';
    
    if (best.percentage >= 95) tier = 'perfect';
    else if (best.percentage >= 85) tier = 'excellent';

    return {
      subjects: qualifiedSubjects,
      tier
    };
  }, [studentData]);

  useEffect(() => {
    if (!stats && onSkip) {
      onSkip();
    }
  }, [stats, onSkip]);

  if (!stats) return null;

  const { tier, subjects } = stats;

  const config = {
    perfect: {
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
      icon: Award,
      title: "Идеальная посещаемость!",
      subtitle: "Ты не пропустил почти ничего",
      emoji: ['🏆', '⭐', '👑', '✨']
    },
    excellent: {
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      icon: Star,
      title: "Отличная посещаемость!",
      subtitle: "Стабильность — признак мастерства",
      emoji: ['⭐', '✨', '💫']
    },
    good: {
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      icon: ThumbsUp,
      title: "Хорошая посещаемость!",
      subtitle: "Ты уверенно идешь к цели",
      emoji: ['👍', '✨', '💪']
    }
  }[tier];

  const Icon = config.icon;

  return (
    <StoryCard gradient={config.gradient}>
      <ParticleBackground count={30} emoji={config.emoji} speed={2} />

      <div className="text-center space-y-6 max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="relative z-10"
        >
          <Icon size={80} className="mx-auto text-white drop-shadow-lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="z-10"
        >
          <h2 className="text-4xl font-bold mb-2">{config.title}</h2>
          <p className="text-xl opacity-90">{config.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 w-full"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2, type: 'spring' }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="text-left flex-1 min-w-0">
                <div className="text-lg font-medium truncate leading-tight mb-1">
                  {subject.name}
                </div>
                <div className="text-sm opacity-80">
                  {subject.attended} из {subject.total} занятий
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{subject.percentage}%</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {tier === 'perfect' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="pt-4"
          >
            <div className="inline-block bg-white/90 text-amber-600 px-6 py-2 rounded-full font-bold text-lg shadow-lg">
              Гордость университета 🎓
            </div>
          </motion.div>
        )}
      </div>
    </StoryCard>
  );
}