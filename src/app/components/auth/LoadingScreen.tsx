import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, useAuthStore } from '@/store/appStore';
import { Loader2 } from 'lucide-react';
import { osuParser } from '@/services/osu-parser';
import { StudentData } from '@/types/student';

export function LoadingScreen() {
  const { loadingMessage, setLoadingMessage, setStage, setStudentData } = useAppStore();
  const { credentials } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!credentials) {
          // If no credentials in store, redirect to login immediately
          // This happens if user manually navigates to scraping stage or store was cleared
          setStage('login');
          return;
        }

        // Set credentials in parser so it can use them for requests
        osuParser.setCredentials(credentials.login, credentials.pass);
        
        setLoadingMessage('Авторизуемся...');
        // Verify login works
        const loggedIn = await osuParser.login(credentials.login, credentials.pass);
        if (!loggedIn) {
          throw new Error("Login failed with saved credentials");
        }

        setLoadingMessage('Получаем информацию о студенте...');
        const mainPageHtml = await osuParser.fetchMainPage();
        const studentProfile = osuParser.parseStudentProfile(mainPageHtml);

        setLoadingMessage('Загружаем данные СКУД...');
        const scudHtml = await osuParser.fetchScud();
        const scudData = osuParser.parseScud(scudHtml);

        setLoadingMessage('Загружаем посещаемость...');
        const attendanceHtml = await osuParser.fetchAttendance();
        const attendanceData = osuParser.parseAttendance(attendanceHtml);

        setLoadingMessage('Анализируем цифровую активность...');
        const statementsHtml = await osuParser.fetchPage('docservice');
        const statementsData = osuParser.parseStatements(statementsHtml);

        const messagesHtml = await osuParser.fetchPage('messenger');
        const messagesData = osuParser.parseMessages(messagesHtml);

        setLoadingMessage('Считаем оценки...');
        const progressHtml = await osuParser.fetchPage('progress');
        const progressData = osuParser.parseProgress(progressHtml);
        
        const studentData: StudentData = {
          student: studentProfile,
          period: { from: "2025-09-01", to: "2025-12-27" },
          scud: scudData, 
          attendance: attendanceData,
          statements: statementsData,
          messages: messagesData,
          progress: progressData
        };

        setStudentData(studentData);
        setStage('stories');
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoadingMessage('Ошибка при получении данных. Попробуйте позже.');
        setTimeout(() => setStage('login'), 3000);
      }
    };

    fetchData();
  }, [setLoadingMessage, setStage, setStudentData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 relative z-10" />
        </div>
        
        <motion.p
          key={loadingMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-light text-center min-h-[3rem]"
        >
          {loadingMessage}
        </motion.p>
      </motion.div>
    </div>
  );
}
