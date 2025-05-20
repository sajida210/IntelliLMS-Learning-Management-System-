// src/pages/UploadQuiz.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import QuizForm from "../components/QuizForm";
import quizAnimation from "../assets/animations/quiz.json";

const UploadQuiz = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center bg-[#EAF6F1] w-full h-screen px-4 py-8 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate("/view-course")}
        className="absolute top-4 left-4 bg-[#AED8D7] text-[#00304D] px-3 py-1 rounded-lg hover:bg-[#adcdc4] transition"
      >
        ← Back to Courses
      </button>

      {/* Container: wider max-width, shorter height */}
      <div className="flex w-full max-w-screen-xl h-[75vh] rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Animation (40% width) */}
        <div className="w-2/5 bg-[#00304D] flex items-center justify-center p-8">
          <Lottie animationData={quizAnimation} loop className="w-74 h-84" />
        </div>

        {/* Right: Form (60% width) */}
        <div className="w-3/5 bg-white/70 backdrop-blur-sm p-8 overflow-auto">
          <QuizForm refreshQuizzes={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default UploadQuiz;
