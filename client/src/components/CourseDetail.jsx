// src/components/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const CourseDetail = ({ userRole }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progressEntries, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState(null);

  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    (async () => {
      try {
        const [cRes, qRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${courseId}`),
          axios.get(`http://localhost:5000/api/quizzes/by-course/${courseId}`)
        ]);
        setCourse(cRes.data);
        setQuizzes(qRes.data);

        if (userRole === "student" && token && studentId) {
          const pRes = await axios.get(
            `http://localhost:5000/api/progress/student/${studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProgress(Array.isArray(pRes.data) ? pRes.data : []);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching course data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, userRole, token, studentId]);

  const toggleSection = (id) =>
    setOpenSection((prev) => (prev === id ? null : id));

  const getEmbedUrl = (url) =>
    url?.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;

  const quizCount = quizzes.length;
  const myEntries = progressEntries.filter((e) => e.courseId === course?._id);
  const totalPct = myEntries.reduce((sum, e) => sum + e.progress, 0);
  const avgPct = quizCount > 0 ? Math.round(totalPct / quizCount) : 0;

  const handleDownloadCertificate = async () => {
    if (avgPct < 100) {
      return Swal.fire(
        "Not yet complete",
        "Finish all quizzes (100%) to unlock certificate.",
        "warning"
      );
    }
    const { value: studentName } = await Swal.fire({
      title: "Enter name on certificate",
      input: "text",
      inputLabel: "Your Full Name",
      showCancelButton: true
    });
    if (!studentName) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/certificates/generate",
        { studentId, courseId, studentName },
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate_${course.title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire("Error", "Could not generate certificate.", "error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#EAF6F1] text-[#063442]">
        <p className="text-lg">Loading…</p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-lg text-[#DC2626]">{error}</p>
    );

  if (!course)
    return (
      <p className="text-center text-lg text-[#022029]">Course not found.</p>
    );

  const Section = ({ title, id, children }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md transition hover:shadow-lg">
      <div
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-[#063442]">{title}</h3>
        {openSection === id ? (
          <ChevronDown className="w-5 h-5 text-[#5DA89B]" />
        ) : (
          <ChevronRight className="w-5 h-5 text-[#5DA89B]" />
        )}
      </div>
      <AnimatePresence>
        {openSection === id && (
          <motion.div
            key={id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 border-t border-[#AED8D7] text-[#022029]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-[#EAF6F1] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <button
          onClick={() =>
            navigate(userRole === "admin" ? "/view-course" : "/student-dashboard")
          }
          className="mb-6 inline-flex items-center gap-2 bg-[#5DA89B] hover:bg-[#4b9e87] text-white px-3 py-1.5 rounded-md shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-2">
          {/* Left panel */}
          <div className="col-span-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-4 space-y-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2
              style={{ fontFamily: "Georgia, serif" }}
              className="text-2xl font-bold text-[#063442]"
            >
              {course.title}
            </h2>
            <p className="text-[#022029] text-sm">{course.description}</p>

            {userRole === "admin" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/edit-course/${courseId}`)}
                  className="flex-1 py-2 bg-[#5DA89B] hover:bg-[#4b9e87] text-white rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Delete this course?")) {
                      await axios.delete(
                        `/api/courses/${courseId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      navigate("/view-course");
                    }
                  }}
                  className="flex-1 py-2 bg-[#063442] hover:bg-[#022029] text-white rounded-md transition"
                >
                  Delete
                </button>
              </div>
            )}

            {userRole === "student" && (
              <div className="mt-3">
                <p className="text-sm text-[#022029] mb-1">Progress</p>
                <div className="w-full bg-[#AED8D7] rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${avgPct}%`, backgroundColor: "#5DA89B" }}
                  />
                </div>
                <p className="text-sm text-[#063442] mt-1">{avgPct}% complete</p>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={avgPct < 100}
                  className={`mt-4 w-full py-2 rounded-md text-white transition ${
                    avgPct === 100
                      ? "bg-[#5DA89B] hover:bg-[#4b9e87]"
                      : "bg-[#AED8D7] cursor-not-allowed"
                  }`}
                >
                  {avgPct === 100
                    ? "Download Certificate"
                    : "Complete quizzes to unlock"}
                </button>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="col-span-2 flex flex-col space-y-6">
            <Section title="Course Video" id="video">
              {course.videoUrl ? (
                <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    src={getEmbedUrl(course.videoUrl)}
                    frameBorder="0"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <p className="text-sm text-[#022029]">No video available.</p>
              )}
            </Section>

            <Section title="Quizzes" id="quizzes">
              {quizzes.length > 0 ? (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => navigate(`/attempt-course/${courseId}`)}
                  className="w-full py-3 bg-[#5DA89B] hover:bg-[#4b9e87] text-white rounded-md transition"
                >
                  Attempt All {quizzes.length} Quizzes
                </motion.button>
              ) : (
                <p className="text-sm text-[#022029]">No quizzes available.</p>
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
