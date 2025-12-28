import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { IntroScreen } from './components/auth/IntroScreen';
import { SecurityWarning } from './components/auth/SecurityWarning';
import { LoginForm } from './components/auth/LoginForm';
import { LoadingScreen } from './components/auth/LoadingScreen';
import { NavigationHints } from './components/NavigationHints';
import { Story1Cover } from './components/stories/Story1Cover';
import { Story0FirstDay } from './components/stories/Story0FirstDay';
import { Story2TotalTime } from './components/stories/Story2TotalTime';
import { Story3LongestDay } from './components/stories/Story3LongestDay';
import { Story3_5EarliestMorning } from './components/stories/Story3_5EarliestMorning';
import { Story4ShortestDay } from './components/stories/Story4ShortestDay';
import { Story5MainBuilding } from './components/stories/Story5MainBuilding';
import { Story6BuildingRating } from './components/stories/Story6BuildingRating';
import { Story7FavoriteTurnstile } from './components/stories/Story7FavoriteTurnstile';
import { Story7_5TurnstileJourney } from './components/stories/Story7_5TurnstileJourney';
import { Story8Attendance } from './components/stories/Story8Attendance';
import { Story9PerfectAttendance } from './components/stories/Story9PerfectAttendance';
import { Story10Tardiness } from './components/stories/Story10Tardiness';
import { Story11FavoriteDay } from './components/stories/Story11FavoriteDay';
import { Story12MorningOrEvening } from './components/stories/Story12MorningOrEvening';
import { Story13DigitalActivity } from './components/stories/Story13DigitalActivity';
import { Story13_5Stadium, getSportStats } from './components/stories/Story13_5Stadium';
import { Story14Moodle } from './components/stories/Story14Moodle';
import { Story14_5YourTeam } from './components/stories/Story14_5YourTeam';
import { Story15Final } from './components/stories/Story15Final';
import { StudentData } from '@/types/student';

const STORY_DURATION = 8000; // 8 seconds per story

type StoryConfig = {
  id: number;
  component: React.ComponentType<any>;
  duration: number;
  condition?: (data: StudentData | null) => boolean;
};

const allStories: StoryConfig[] = [
  { id: 1, component: Story1Cover, duration: 6000 },
  { 
    id: 2, 
    component: Story0FirstDay, 
    duration: 8000, 
    condition: (d) => !!d?.scud?.days?.some(day => day.total_time_seconds > 0) 
  },
  { id: 3, component: Story2TotalTime, duration: 8000, condition: (d) => !!d?.scud?.days?.length },
  { 
    id: 4, 
    component: Story3LongestDay, 
    duration: 7000, 
    condition: (d) => !!d?.scud?.days?.some(day => day.total_time_seconds > 0) 
  },
  { 
    id: 5, 
    component: Story3_5EarliestMorning, 
    duration: 8000, 
    condition: (d) => !!d?.scud?.days?.some(day => day.total_time_seconds > 0) 
  },
  { 
    id: 6, 
    component: Story4ShortestDay, 
    duration: 7000, 
    condition: (d) => !!d?.scud?.days?.some(day => day.total_time_seconds > 0) 
  },
  { id: 7, component: Story5MainBuilding, duration: 7000, condition: (d) => !!d?.scud?.days?.length },
  { id: 8, component: Story6BuildingRating, duration: 8000, condition: (d) => !!d?.scud?.days?.length },
  { id: 9, component: Story7FavoriteTurnstile, duration: 8000, condition: (d) => !!d?.scud?.days?.length },
  { id: 10, component: Story7_5TurnstileJourney, duration: 10000, condition: (d) => !!d?.scud?.days?.length },
  { 
    id: 11, 
    component: Story8Attendance, 
    duration: 8000,
    condition: (d) => !!d?.attendance?.days?.some(day => day.classes.length > 0)
  },
  { 
    id: 12, 
    component: Story9PerfectAttendance, 
    duration: 8000,
    condition: (d) => !!d?.attendance?.days?.some(day => day.classes.length > 0)
  },
  { 
    id: 14, 
    component: Story10Tardiness, 
    duration: 9000,
    condition: (d) => !!d?.attendance?.days?.some(day => day.classes.length > 0)
  },
  { id: 15, component: Story11FavoriteDay, duration: 8000 },
  { id: 16, component: Story12MorningOrEvening, duration: 8000 },
  { id: 17, component: Story13DigitalActivity, duration: 8000 },
  { 
    id: 18, 
    component: Story13_5Stadium, 
    duration: 8000,
    condition: (d) => {
      const stats = getSportStats(d);
      return !!stats && stats.percentage > 1.1;
    }
  },
  { id: 19, component: Story14Moodle, duration: 8000 },
  { 
    id: 20, 
    component: Story14_5YourTeam, 
    duration: 10000,
    condition: (d) => !!(d?.student?.headman && d?.student?.curator && d?.student?.group)
  },
  { id: 21, component: Story15Final, duration: 12000 },
];

export default function App() {
  const { stage, credentials, studentData, currentStory, setStage, setCredentials, setCurrentStory } = useAppStore();
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const stories = useMemo(() => {
    return allStories.filter(story => !story.condition || story.condition(studentData));
  }, [studentData]);

  // Check for saved credentials on mount
  useEffect(() => {
    if (stage === 'intro' && credentials) {
      // Auto-login if credentials exist
      setStage('scraping');
    }
  }, [stage, credentials, setStage]);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const currentDuration = stories[currentStory]?.duration || STORY_DURATION;

  const handleNext = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  };

  const handlePrevious = () => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Auto-play functionality
  useEffect(() => {
    if (stage !== 'stories') return;

    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now() - elapsedRef.current;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const newProgress = (elapsed / currentDuration) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentStory, isPaused, currentDuration]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
  }, [currentStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        if (e.key === ' ') {
          e.preventDefault();
          togglePause();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStory, isPaused]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrevious();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  const handleStoryClick = (side: 'left' | 'center' | 'right') => {
    if (side === 'left') {
      handlePrevious();
    } else if (side === 'center') {
      togglePause();
    } else {
      handleNext();
    }
  };

  const CurrentStoryComponent = stories[currentStory].component;

  if (stage === 'intro') return <IntroScreen />;
  if (stage === 'security') return <SecurityWarning />;
  if (stage === 'login') return <LoginForm />;
  if (stage === 'scraping') return <LoadingScreen />;

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Story container */}
      <div className="relative w-full max-w-2xl h-full md:h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl">
        {/* Progress bars with auto-play */}
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <motion.div
                animate={{
                  width:
                    index < currentStory
                      ? '100%'
                      : index === currentStory
                      ? `${progress}%`
                      : '0%',
                }}
                transition={{ duration: 0.05, ease: 'linear' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          ))}
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                <Pause size={32} className="text-white" fill="white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story content with drag */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
          className="w-full h-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <CurrentStoryComponent onSkip={handleNext} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation areas (3-zone tap like Instagram) */}
        <div className={`absolute inset-0 z-40 flex ${currentStory === stories.length - 1 ? 'pointer-events-none' : ''}`}>
          {/* Left zone - Previous */}
          <button
            onClick={() => handleStoryClick('left')}
            disabled={currentStory === 0}
            className={`flex-[3] cursor-pointer ${
              currentStory === 0 ? 'cursor-default' : ''
            }`}
            aria-label="Previous story"
          />

          {/* Center zone - Pause/Play */}
          <button
            onClick={() => handleStoryClick('center')}
            className="flex-[4] cursor-pointer"
            aria-label="Pause/Play story"
          />

          {/* Right zone - Next */}
          <button
            onClick={() => handleStoryClick('right')}
            disabled={currentStory === stories.length - 1}
            className={`flex-[3] cursor-pointer ${
              currentStory === stories.length - 1 ? 'cursor-default' : ''
            }`}
            aria-label="Next story"
          />
        </div>

        {/* Navigation buttons (visible on hover) */}
        {currentStory > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors opacity-0"
          >
            <ChevronLeft size={28} className="text-white" />
          </motion.button>
        )}

        {currentStory < stories.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors opacity-0"
          >
            <ChevronRight size={28} className="text-white" />
          </motion.button>
        )}

        {/* Story counter and controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
          <div className="px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white text-sm">
            {currentStory + 1} / {stories.length}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePause}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            {isPaused ? (
              <Play size={20} className="text-white ml-0.5" fill="white" />
            ) : (
              <Pause size={20} className="text-white" fill="white" />
            )}
          </motion.button>
        </div>
      </div>
      <NavigationHints />
    </div>
  );
}