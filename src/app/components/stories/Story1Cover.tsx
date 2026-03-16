import { motion } from "motion/react";
import { StoryCard } from "../StoryCard";
import { ParticleBackground } from "../ParticleBackground";
import { useAppStore } from "@/store/appStore";
import { useMemo } from "react";

export function Story1Cover() {
  const studentData = useAppStore((state) => state.studentData);
  const semester = useAppStore((state) => state.semester);

  const semesterInfo = useMemo(() => {
    if (!studentData?.scud?.days?.length)
      return {
        year: new Date().getFullYear(),
        season: semester === "autumn" ? "Осенний" : "Весенний",
      };

    // Find the most common year in the data
    const years: Record<number, number> = {};
    studentData.scud.days.forEach((day) => {
      const year = new Date(day.date).getFullYear();
      years[year] = (years[year] || 0) + 1;
    });

    const year = parseInt(
      Object.entries(years).sort((a, b) => b[1] - a[1])[0][0],
    );

    return { year, season: semester === "spring" ? "Весенний" : "Осенний" };
  }, [studentData, semester]);

  const gradient =
    semester === "spring"
      ? "from-emerald-500 via-teal-400 to-green-500"
      : "from-amber-600 via-orange-500 to-red-500";

  const emojis =
    semester === "spring" ? ["🌱", "🌿", "✨", "🌸"] : ["🍂", "🍁", "✨"];

  return (
    <StoryCard gradient={gradient}>
      {/* Falling leaves animation */}
      <ParticleBackground count={20} emoji={emojis} speed={3} />

      <div className="z-10 text-center flex flex-col items-center justify-center h-full pb-10 md:pb-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 md:mb-8"
        >
          <div className="text-lg md:text-2xl font-light tracking-widest uppercase opacity-80 mb-2">
            ОГУ Recap
          </div>
          <div className="w-12 md:w-16 h-1 bg-white/50 mx-auto rounded-full" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {semesterInfo.season}
          <br />
          семестр
          <br />
          <span className="text-yellow-300">{semesterInfo.year}</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl opacity-90 max-w-md mx-auto leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Это был долгий путь.
          <br />
          Давай посмотрим, как он прошел.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-0 right-0 text-center"
        >
          <p className="text-sm opacity-60 uppercase tracking-widest animate-pulse">
            Нажми, чтобы продолжить
          </p>
        </motion.div>
      </div>
    </StoryCard>
  );
}
