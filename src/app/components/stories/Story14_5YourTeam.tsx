import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Users, Crown, Heart } from 'lucide-react';
import { useAppStore } from '../../../store/appStore';

export function Story14_5YourTeam() {
  const studentData = useAppStore((state) => state.studentData);
  const { headman, curator, group } = studentData?.student || {};

  const formatName = (fullName: string | undefined) => {
    if (!fullName) return { line1: 'Не указан', line2: '' };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        line1: `${parts[0]} ${parts[1]}`,
        line2: parts.slice(2).join(' '),
      };
    }
    return { line1: fullName, line2: '' };
  };

  const headmanName = formatName(headman);
  const curatorName = formatName(curator);

  return (
    <StoryCard gradient="from-violet-600 via-purple-600 to-fuchsia-600">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Users className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-2 md:mb-4">Твоя команда</h2>
          <p className="text-lg md:text-xl opacity-90">Люди, которые с тобой</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 md:space-y-6"
        >
          {/* Headman */}
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: -10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 md:p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-2 md:mb-4">
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
              <h3 className="text-lg md:text-2xl">Староста</h3>
            </div>
            <p className="text-xl md:text-3xl mb-1 md:mb-2">{headmanName.line1}</p>
            <p className="text-xl md:text-3xl">{headmanName.line2}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-2 md:mt-4 text-lg md:text-xl opacity-80"
            >
              Тот, кто всё организует 📋
            </motion.div>
          </motion.div>

          {/* Curator */}
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: 'spring' }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 md:p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-2 md:mb-4">
              <Heart className="w-8 h-8 md:w-10 md:h-10" fill="white" />
              <h3 className="text-lg md:text-2xl">Куратор</h3>
            </div>
            <p className="text-lg md:text-2xl mb-1">{curatorName.line1}</p>
            <p className="text-lg md:text-2xl">{curatorName.line2}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-2 md:mt-4 text-lg md:text-xl opacity-80"
            >
              Поддержка и забота 🤗
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="space-y-2 md:space-y-3 pt-2 md:pt-4"
        >
          <p className="text-lg md:text-2xl">Группа {group || 'Неизвестно'}</p>
          <p className="text-lg md:text-xl opacity-80 italic">
            Вместе вы — сила! 💪
          </p>
        </motion.div>
      </div>
    </StoryCard>
  );
}
