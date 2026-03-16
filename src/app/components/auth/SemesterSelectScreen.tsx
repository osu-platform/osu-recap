import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useAppStore } from "@/store/appStore";
import { SemesterOption } from "@/store/appStore";

export function SemesterSelectScreen() {
  const { setStage, setSemester } = useAppStore();

  const handleSelect = (semester: SemesterOption) => {
    setSemester(semester);
    setStage("scraping");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 md:space-y-8 text-center"
      >
        <h2 className="text-xl md:text-3xl font-light">Выберите семестр</h2>
        <p className="text-sm md:text-base text-gray-500">
          За какой семестр вы хотите посмотреть итоги?
        </p>

        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full py-4 md:py-6 text-base md:text-lg rounded-full"
            onClick={() => handleSelect("autumn")}
          >
            Осенний семестр
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full py-4 md:py-6 text-base md:text-lg rounded-full"
            onClick={() => handleSelect("spring")}
          >
            Весенний семестр
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
