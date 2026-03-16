import { useEffect } from "react";
import { motion } from "motion/react";
import { useAppStore, useAuthStore } from "@/store/appStore";
import { Loader2 } from "lucide-react";
import { osuParser } from "@/services/osu-parser";
import { StudentData } from "@/types/student";

export function LoadingScreen() {
  const {
    loadingMessage,
    setLoadingMessage,
    setStage,
    setStudentData,
    semester,
  } = useAppStore();
  const { credentials } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!credentials) {
          // If no credentials in store, redirect to login immediately
          // This happens if user manually navigates to scraping stage or store was cleared
          setStage("login");
          return;
        }

        // Set credentials in parser so it can use them for requests
        osuParser.setCredentials(credentials.login, credentials.pass);
        osuParser.setStatusCallback(setLoadingMessage);

        setLoadingMessage("Авторизуемся...");
        // Verify login works
        const loggedIn = await osuParser.login(
          credentials.login,
          credentials.pass,
        );
        if (!loggedIn) {
          throw new Error("Login failed with saved credentials");
        }

        setLoadingMessage("Получаем информацию о студенте...");
        const mainPageHtml = await osuParser.fetchMainPage();
        const studentProfile = osuParser.parseStudentProfile(mainPageHtml);

        // Determine date ranges based on semester
        const now = new Date();
        // If we are in Jan-Jul, academic year started last year.
        // If we are in Aug-Dec, academic year stared this year.
        const academicYearStart =
          now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();

        let dateFrom = `01.09.${academicYearStart}`;
        let dateTo = `07.02.${academicYearStart + 1}`;
        let periodFrom = `${academicYearStart}-09-01`;
        let periodTo = `${academicYearStart + 1}-02-07`;

        if (semester === "spring") {
          dateFrom = `08.02.${academicYearStart + 1}`;
          dateTo = `31.08.${academicYearStart + 1}`;
          periodFrom = `${academicYearStart + 1}-02-08`;
          periodTo = `${academicYearStart + 1}-08-31`;
        }

        setLoadingMessage("Загружаем данные СКУД...");
        const scudHtml = await osuParser.fetchScud(dateFrom, dateTo);
        const scudData = osuParser.parseScud(scudHtml);

        setLoadingMessage("Загружаем посещаемость...");
        const attendanceHtml = await osuParser.fetchAttendance(
          dateFrom,
          dateTo,
        );
        const attendanceData = osuParser.parseAttendance(attendanceHtml);

        setLoadingMessage("Анализируем цифровую активность...");
        const statementsHtml = await osuParser.fetchPage("docservice");
        const statementsData = osuParser.parseStatements(statementsHtml);

        const messagesHtml = await osuParser.fetchPage("messenger");
        const messagesData = osuParser.parseMessages(messagesHtml);

        setLoadingMessage("Считаем оценки...");
        const progressHtml = await osuParser.fetchPage("progress");
        const progressData = osuParser.parseProgress(progressHtml);

        const studentData: StudentData = {
          student: studentProfile,
          period: { from: periodFrom, to: periodTo },
          scud: scudData,
          attendance: attendanceData,
          statements: statementsData,
          messages: messagesData,
          progress: progressData,
        };

        setStudentData(studentData);
        setStage("stories");
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoadingMessage("Ошибка при получении данных. Попробуйте позже.");
        setTimeout(() => setStage("login"), 3000);
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
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-500 relative z-10" />
        </div>

        <motion.p
          key={loadingMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg md:text-xl font-light text-center min-h-[3rem]"
        >
          {loadingMessage}
        </motion.p>
      </motion.div>
    </div>
  );
}
