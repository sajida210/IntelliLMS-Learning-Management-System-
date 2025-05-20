// src/components/Footer.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/signup"];
  if (hideFooterRoutes.includes(location.pathname)) return null;

  return (
    <footer className="bg-[#AED8D7] text-[#022029] py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-center md:items-start">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold mb-3">Get Connected</h2>
          <p className="text-[#000000] mb-3 leading-relaxed"> 
            We’re the DevXplorers!<br />your LMS dev crew, navigating MongoDB, Express, React, and Node with expertise. <br />
            Fueled by innovation, teamwork, and a pinch of passion.
          </p>
          <div className="flex justify-center md:justify-start gap-3 mt-3">
            <a
              href="https://www.instagram.com/_akhilnalla_/"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-white bg-[#355B8C] p-2 rounded-md hover:scale-105 transition-transform"></i>
            </a>
            <a href="https://www.linkedin.com/in/akhilnalla" aria-label="LinkedIn">
              <i className="fab fa-linkedin text-white bg-[#355B8C] p-2 rounded-md hover:scale-105 transition-transform"></i>
            </a>
            <a href="#" aria-label="Pinterest">
              <i className="fab fa-pinterest text-white bg-[#355B8C] p-2 rounded-md hover:scale-105 transition-transform"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter text-white bg-[#355B8C] p-2 rounded-md hover:scale-105 transition-transform"></i>
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
        <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-64 text-center hover:scale-105 transition"> 
            <i className="fab fa-dribbble text-[#355B8C] text-2xl mb-2"></i>
            <p className="text-[#022029] font-medium text-sm">srmap.edu.in</p>
          </div>
          <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg w-64 text-center hover:scale-105 transition">
            <i className="fas fa-envelope text-[#355B8C] text-2xl mb-2"></i>
            <p className="text-[#022029] font-medium text-sm">lmssupport@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
