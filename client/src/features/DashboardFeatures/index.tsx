import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full relative overflow-hidden text-white">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 -z-20 animate-gradient-slow bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 bg-[length:400%_400%]"
        style={{
          animation: "gradient 12s ease infinite",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/70 rounded-full shadow-md"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: 0,
            }}
            animate={{
              y: ["100%", "-10%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Glassmorphic Card */}
      <motion.div
        className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl py-14 text-center max-w-xl w-full ring-1 ring-white/20 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

        {/* Title */}
        <motion.h1
          className="relative text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent animate-text-shimmer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t("dashboard.title")}
        </motion.h1>

        {/* Coming Soon Animation */}
        <TypeAnimation
          sequence={[t("dashboard.comingSoon"), 2000]}
          wrapper="h2"
          speed={60}
          repeat={Infinity}
          className="mt-6 text-2xl md:text-3xl font-semibold text-emerald-100"
        />
      </motion.div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-slow {
          animation: gradient 12s ease infinite;
        }
        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
