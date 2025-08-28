import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const userName = "John";

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [i18n.language]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning", "Good Morning");
    if (hour < 18) return t("dashboard.goodAfternoon", "Good Afternoon");
    return t("dashboard.goodEvening", "Good Evening");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-green-400 via-green-500 to-green-700">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-20 animate-gradient-slow bg-gradient-to-r from-green-300 via-green-500 to-emerald-600 bg-[length:400%_400%]" />

      {/* Floating Clouds */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-40 h-14 bg-white/40 rounded-full blur-xl animate-cloud-slow" />
        <div className="absolute top-40 left-1/2 w-52 h-16 bg-white/30 rounded-full blur-xl animate-cloud-medium" />
        <div className="absolute top-64 right-1/4 w-44 h-14 bg-white/20 rounded-full blur-xl animate-cloud-fast" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/70 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: ["100%", "-10%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Glassmorphic Card */}
      <motion.div
        className="relative bg-white/20 backdrop-blur-xl text-white border border-white/30 rounded-3xl shadow-2xl px-10 py-14 text-center max-w-xl w-full ring-1 ring-white/30 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

        {/* Animated Welcome Message */}
        <TypeAnimation
          key={key} // 🔑 re-runs animation when key changes
          sequence={[`${getTimeGreeting()}, ${userName || "there"}!`, 1500]}
          wrapper="h1"
          speed={55}
          className="relative text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent animate-text-shimmer"
          repeat={0}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
