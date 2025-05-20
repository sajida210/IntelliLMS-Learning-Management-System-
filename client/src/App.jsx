// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import UploadCourse from "./pages/UploadCourse";
import ViewCourse from "./pages/ViewCourse";
import UploadQuiz from "./pages/UploadQuiz";
import EditCourse from "./pages/EditCourse";
import AttemptCourseQuizzes from "./components/AttemptCourseQuizzes";

const AppWrapper = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  // hide Navbar/Footer on home, login, signup, course detail, attempt‑course
  const hideLayoutRoutes = [
    "/", 
    "/login", 
    "/signup", 
    "/upload-course", 
    "/upload-quiz"
  ];
  
  const path = location.pathname;
  const shouldShowLayout =
    !hideLayoutRoutes.includes(path) &&
    !path.startsWith("/edit-course/") &&
    !path.startsWith("/course/") &&
    !path.startsWith("/attempt-course/");

  return (
    <>
      {shouldShowLayout && (
        <Navbar isAuthenticated={isAuthenticated} userRole={role} />
      )}

      <div className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Only */}
          <Route
            path="/admin"
            element={
              isAuthenticated && role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/upload-course"
            element={
              isAuthenticated && role === "admin" ? (
                <UploadCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/edit-course/:courseId"
            element={
              isAuthenticated && role === "admin" ? (
                <EditCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/view-course"
            element={
              isAuthenticated && role === "admin" ? (
                <ViewCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/upload-quiz"
            element={
              isAuthenticated && role === "admin" ? (
                <UploadQuiz />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Student & Admin */}
          <Route
            path="/courses"
            element={
              isAuthenticated ? <CourseList userRole={role} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/course/:courseId"
            element={
              isAuthenticated ? (
                <CourseDetail userRole={role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Attempt all quizzes for a course */}
          <Route
            path="/attempt-course/:courseId"
            element={
              isAuthenticated ? (
                <AttemptCourseQuizzes />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Student Only */}
          <Route
            path="/student-dashboard"
            element={
              isAuthenticated && role === "student" ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {shouldShowLayout && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
