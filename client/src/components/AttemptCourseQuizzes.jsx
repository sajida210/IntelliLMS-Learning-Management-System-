// src/components/AttemptCourseQuizzes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const AttemptCourseQuizzes = () => {
  const { courseId } = useParams();
  const navigate     = useNavigate();

  const [courseName, setCourseName]             = useState("");
  const [quizzes, setQuizzes]                   = useState([]);
  const [responses, setResponses]               = useState({});
  const [submittedQuizIds, setSubmittedQuizIds] = useState([]);
  const [resultsMap, setResultsMap]             = useState({});
  const [loading, setLoading]                   = useState(true);
  const [currentIndex, setCurrentIndex]         = useState({});

  const token     = localStorage.getItem("token");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, quizRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${courseId}`),
          axios.get(`http://localhost:5000/api/quizzes/by-course/${courseId}`)
        ]);
        setCourseName(courseRes.data.title || "Untitled Course");
        setQuizzes(quizRes.data);

        const init = {};
        quizRes.data.forEach(q => { init[q._id] = 0 });
        setCurrentIndex(init);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not load course or quizzes", "error");
        setCourseName("Unavailable");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleAnswerChange = (quizId, questionId, choice) => {
    setResponses(prev => ({
      ...prev,
      [quizId]: { ...(prev[quizId] || {}), [questionId]: choice }
    }));
  };

  const handleSubmitQuiz = async (quizId) => {
    const quiz      = quizzes.find(q => q._id === quizId);
    const answerMap = responses[quizId] || {};
    const payload   = quiz.questions.map(q => ({
      questionId: q._id,
      selectedAnswer: answerMap[q._id] || ""
    }));

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/quizzes/submit",
        { studentId, quizId, responses: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultsMap(r => ({ ...r, [quizId]: data.results }));
      setSubmittedQuizIds(s => [...s, quizId]);

      const total   = data.results.length;
      const correct = data.results.filter(r => r.isCorrect).length;
      await axios.post(
        "http://localhost:5000/api/progress/save",
        { studentId, courseId, quizId, correctAnswers: correct, totalQuestions: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Quiz submitted", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  if (loading) return <p className="text-center py-6 text-lg text-[#00304D]">Loading…</p>;
  if (!quizzes.length) return <p className="text-center py-6 text-lg text-[#00304D]">No quizzes found.</p>;

  return (
    <div className="relative min-h-screen bg-[#EAF6F1] p-6 overflow-x-hidden">
      {/* only top-left glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#AED8D7] opacity-30 blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="inline-block bg-[#AED8D7]/30 text-[#00304D] px-6 py-3 rounded-2xl text-3xl font-bold shadow-md backdrop-blur-md">
            📚 {courseName}
          </h1>
        </div>

        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="mb-6 px-5 py-2 bg-[#AED8D7]/60 text-[#00304D] rounded-full backdrop-blur-md shadow hover:shadow-lg transition"
        >
          ← Back to Course
        </button>

        <div className="space-y-16">
          {quizzes.map((quiz, quizIdx) => {
            const isSubmitted = submittedQuizIds.includes(quiz._id);
            const results     = resultsMap[quiz._id] || [];
            const idx         = currentIndex[quiz._id] || 0;
            const question    = quiz.questions[idx];

            return (
              <section key={quiz._id}>
                {/* Quiz badge */}
                <div className="flex justify-center mb-4">
                  <span className="bg-[#00304D] text-white px-4 py-1 rounded-full text-sm">
                    Quiz {quizIdx + 1} of {quizzes.length}
                  </span>
                </div>

                <div className="relative max-w-xl mx-auto">
                  <AnimatePresence initial={false} custom={idx}>
                    <motion.div
                      key={question._id}
                      custom={idx}
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-[#00304D] mb-6">
                          {question.questionText}
                        </p>
                        <ul className="grid grid-cols-2 gap-4">
                          {question.options.map(opt => {
                            const r       = results.find(r => r.questionId === question._id);
                            const correct = r?.isCorrect && r.selectedAnswer === opt;
                            const wrong   = r && r.selectedAnswer === opt && !r.isCorrect;

                            return (
                              <li key={opt}>
                                <label
                                  className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg border transition cursor-pointer
                                    ${
                                      correct
                                        ? "bg-[#DCFCE7] border-[#86EFAC] text-[#166534]"
                                        : wrong
                                        ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]"
                                        : "bg-white border-[#E5E7EB] hover:border-[#AED8D7]"
                                    }
                                  `}
                                >
                                  <input
                                    type="radio"
                                    name={`quiz-${quiz._id}-q-${question._id}`}
                                    value={opt}
                                    disabled={isSubmitted}
                                    checked={(responses[quiz._id]?.[question._id] || "") === opt}
                                    onChange={() => handleAnswerChange(quiz._id, question._id, opt)}
                                    className="h-5 w-5"
                                  />
                                  <span>{opt}</span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          if (idx < quiz.questions.length - 1) {
                            setCurrentIndex(ci => ({
                              ...ci,
                              [quiz._id]: idx + 1
                            }));
                          } else {
                            handleSubmitQuiz(quiz._id);
                          }
                        }}
                        className="mt-8 mx-auto px-6 py-2 font-semibold rounded-full bg-gradient-to-r from-[#AED8D7] to-[#00304D] text-white shadow-lg hover:from-[#89c6be] hover:to-[#001f2d] transition"
                      >
                        {idx < quiz.questions.length - 1 ? "Next Question" : "Submit Quiz"}
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  {isSubmitted && (
                    <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg">
                      <h4 className="text-lg font-semibold mb-4 text-[#00304D]">Results:</h4>
                      <ul className="space-y-2 text-[#00304D]">
                        {results.map((r, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <span className={r.isCorrect ? "text-[#16A34A]" : "text-[#DC2626]"}>
                              {r.isCorrect ? "✅" : "❌"}
                            </span>
                            <span>
                              {r.questionText} — your answer: <strong>{r.selectedAnswer}</strong>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttemptCourseQuizzes;
