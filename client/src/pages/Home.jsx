// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import landingAnimation from "../assets/animations/landing.json"; // your Lottie JSON

const Home = () => (
  <div className="flex w-full h-screen bg-[#EAF6F1] overflow-hidden">
    {/* Left: Text/Search/Buttons (40%) */}
    <div className="w-2/5 flex flex-col justify-center px-12 lg:px-24 z-10">
      <h2 className="text-sm uppercase text-[#5DA89B] font-semibold mb-2">
        IntelliLMS
      </h2>
      <h1 className="text-5xl lg:text-6xl font-extrabold text-[#022029] mb-6 leading-tight">
        Start learning<br/>at home
      </h1>

      {/* CTAs */}
      <div className="flex gap-4">
        <Link
          to="/courses"
          className="px-6 py-3 bg-[#5DA89B] text-white rounded-full hover:bg-[#4b9e87] transition"
        >
          Browse Courses
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-[#00304D] text-white rounded-full hover:bg-[#022029] transition"
        >
          Sign Up
        </Link>
      </div>
    </div>

    {/* Right: Curved Lottie (60%) */}
    <div className="w-3/5 relative">
      <div
        className="absolute inset-0"
        style={{
          clipPath: "ellipse(75% 100% at 0 50%)",
        }}
      >
        <Lottie
           animationData={landingAnimation}
           loop
           className="w-full h-full object-cover"
         />
      </div>
    </div>
  </div>
);

export default Home;
