import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Users, Crown, Heart } from 'lucide-react';

export function Story14_5YourTeam() {
  return (
    <StoryCard gradient="from-violet-600 via-purple-600 to-fuchsia-600">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Users size={80} className="mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl mb-4">Твоя команда</h2>
          <p className="text-xl opacity-90">Люди, которые с тобой</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Headman */}
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: -10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Crown size={40} className="text-yellow-300" />
              <h3 className="text-2xl">Староста</h3>
            </div>
            <p className="text-3xl mb-2">Волков Никита</p>
            <p className="text-3xl">Денисович</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 text-xl opacity-80"
            >
              Тот, кто всё организует 📋
            </motion.div>
          </motion.div>

          {/* Curator */}
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: 'spring' }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Heart size={40} fill="white" />
              <h3 className="text-2xl">Куратор</h3>
            </div>
            <p className="text-2xl mb-1">Туктамышева Лилия</p>
            <p className="text-2xl">Мухаммадиевна</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-4 text-xl opacity-80"
            >
              Поддержка и забота 🤗
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="space-y-3 pt-4"
        >
          <p className="text-2xl">Группа 25ИСТ(б)-1</p>
          <p className="text-xl opacity-80 italic">
            Вместе вы — сила! 💪
          </p>
        </motion.div>
      </div>
    </StoryCard>
  );
}
