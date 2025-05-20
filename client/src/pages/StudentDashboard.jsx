// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progressEntries, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("studentId");
  const { searchQuery } = useSearch();

  useEffect(() => {
    if (!token) return navigate("/login");

    const enrollReq = axios.get("http://localhost:5000/api/enroll/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const quizReq = axios.get("http://localhost:5000/api/quizzes/all");
    const progReq = axios.get(
      `http://localhost:5000/api/progress/student/${studentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Promise.all([enrollReq, quizReq, progReq])
      .then(([eRes, qRes, pRes]) => {
        setCourses(Array.isArray(eRes.data) ? eRes.data : []);
        setQuizzes(Array.isArray(qRes.data) ? qRes.data : []);
        setProgress(Array.isArray(pRes.data) ? pRes.data : []);
      })
      .catch(() => {
        // optionally show a toast
      })
      .finally(() => setLoading(false));
  }, [token, studentId, navigate]);

  if (loading) {
    return <p className="p-6 text-center">Loading your dashboard…</p>;
  }

  const withProgress = courses
    .filter((course) => course && course._id)
    .map((course) => {
      const myQuizzes = quizzes.filter((q) => q.courseId === course._id);
      const quizCount = myQuizzes.length;
      const myEntries = progressEntries.filter((e) => e.courseId === course._id);
      const totalPct = myEntries.reduce((sum, e) => sum + e.progress, 0);
      const avgPct = quizCount > 0 ? Math.round(totalPct / quizCount) : 0;
      return { ...course, avgPct, quizCount };
    });

  const filtered = withProgress.filter(({ title, description }) =>
    title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EAF6F1] px-6 py-10">
      <h2
        className="text-4xl font-semibold text-center text-[#063442] mb-8"
        style={{ fontFamily: "Franklin Gothic, serif" }}
      >
        My Enrolled Courses
      </h2>

      {filtered.length === 0 ? (
        <p className="text-center text-[#022029]">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filtered.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              className="cursor-pointer bg-white/70 backdrop-blur-sm rounded-xl shadow-md transition-transform hover:scale-105 max-w-sm mx-auto flex flex-col"
            >
              <img
                src={course.thumbnail || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-36 object-cover rounded-t-xl"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-[#022029] mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-[#022029] mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="text-xs text-gray-600 mb-1">Progress</div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className={`h-2 rounded transition-all duration-300 ${
                      course.avgPct > 0
                        ? "bg-[#5DA89B] hover:bg-[#4b9e87]"
                        : "bg-[#AED8D7] cursor-not-allowed"
                    }`}
                    style={{ width: `${course.avgPct}%` }}
                  />
                </div>
                <div className="mt-1 text-sm font-medium text-[#4b9e87]">
                  {course.avgPct}% across {course.quizCount}{" "}
                  {course.quizCount === 1 ? "quiz" : "quizzes"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
