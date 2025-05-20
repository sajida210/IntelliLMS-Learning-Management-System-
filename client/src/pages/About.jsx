// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import aboutAnimation from "../assets/animations/about.json";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" },
});

const About = () => (
  <div className="relative bg-[#EAF6F1] text-[#022029] overflow-hidden min-h-screen py-24">
    {/* Floating book icons */}
    <BookOpenIcon className="absolute top-12 left-6 w-20 h-20 text-[#AED8D7] opacity-30 animate-pulse-slow" />
    <BookOpenIcon className="absolute top-1/3 right-10 w-16 h-16 text-[#5DA89B] opacity-25 animate-bounce-slow" />
    <BookOpenIcon className="absolute bottom-20 left-1/4 w-24 h-24 text-[#5DA89B] opacity-20 animate-pulse-slower" />

    {/* Intro */}
    <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-6">
      {/* Left Column */}
      <motion.div {...fadeUp(0.2)} className="space-y-8">
        <motion.h1 {...fadeUp(0.3)} className="text-5xl md:text-6xl font-extrabold">
          About Our IntelliLMS
        </motion.h1>
        <motion.p
          {...fadeUp(0.4)}
          className="inline-block bg-gradient-to-r from-[#5DA89B] to-[#063442] bg-clip-text text-transparent text-xl font-semibold"
        >
          Safe, comprehensive, and fast platform
        </motion.p>
        <motion.p
          {...fadeUp(0.5)}
          className="text-gray-700 text-lg leading-relaxed"
        >
          Our LMS empowers students and administrators with a transparent, technology-driven
          platform. Create, manage, and engage with courses—track progress, take
          quizzes, and watch video lessons all in one place.
        </motion.p>
        <motion.div {...fadeUp(0.6)} className="flex gap-6">
        </motion.div>
      </motion.div>

      {/* Right Column: Lottie (no extra container) */}
      <motion.div
        {...fadeUp(0.7)}
        className="flex justify-center transform hover:scale-105 transition duration-500"
      >
        <Lottie
          animationData={aboutAnimation}
          loop
          className="w-full max-w-md h-auto"
        />
      </motion.div>
    </div>

    {/* Stats Section */}
    <div className="mt-20 border-t border-[#AED8D7]/50 pt-16 pb-32">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { Icon: CalendarDaysIcon, num: "1,400+", label: "Courses" },
          { Icon: UserGroupIcon,    num: "13,560", label: "Students" },
          { Icon: BookOpenIcon,     num: "20,123", label: "Quizzes Taken" },
        ].map(({ Icon, num, label }, i) => (
          <motion.div
            {...fadeUp(0.8 + i * 0.2)}
            key={label}
            className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition"
          >
            <Icon className="mx-auto w-12 h-12 text-[#5DA89B] mb-4 group-hover:text-[#063442] transition-colors" />
            <h3 className="text-4xl font-bold text-[#063442] mb-1">{num}</h3>
            <p className="uppercase text-sm tracking-wider text-gray-600">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
