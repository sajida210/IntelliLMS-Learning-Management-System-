// src/components/QuizForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const QuizForm = ({ refreshQuizzes = () => {} }) => {
  const [courseId, setCourseId]           = useState("");
  const [courses, setCourses]             = useState([]);
  const [questionText, setQuestionText]   = useState("");
  const [options, setOptions]             = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errorMessage, setErrorMessage]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/all");
        setCourses(res.data);
      } catch (e) {
        console.error("Error fetching courses:", e);
      }
    })();
  }, []);

  const handleOptionChange = (i, val) => {
    const o = [...options];
    o[i] = val;
    setOptions(o);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !questionText || options.some(o => !o) || !correctAnswer) {
      setErrorMessage("All fields are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/quizzes/add",
        { courseId, questions: [{ questionText, options, correctAnswer }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz added!");
      setCourseId("");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setErrorMessage("");
      refreshQuizzes();
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to add quiz");
    }
  };

  return (
    <div className="h-full w-full p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-auto flex flex-col">
      <h3 className="text-2xl font-semibold text-[#00304D] text-center mb-6">
        📝 Add Quiz
      </h3>

      {errorMessage && (
        <p className="text-sm text-[#DC2626] text-center mb-6">
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Course Select */}
        <div>
          <label className="block text-sm font-medium text-[#022029] mb-1">
            Select Course
          </label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-[#AED8D7] rounded-lg focus:ring-2 focus:ring-[#5DA89B] focus:border-transparent"
          >
            <option value="">— Choose a Course —</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-[#022029] mb-1">
            Question
          </label>
          <input
            type="text"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-[#AED8D7] rounded-lg focus:ring-2 focus:ring-[#5DA89B] focus:border-transparent"
          />
        </div>

        {/* Options */}
        {options.map((opt, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-[#022029] mb-1">
              Option {i + 1}
            </label>
            <input
              type="text"
              value={opt}
              onChange={e => handleOptionChange(i, e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#AED8D7] rounded-lg focus:ring-2 focus:ring-[#5DA89B] focus:border-transparent"
            />
          </div>
        ))}

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium text-[#022029] mb-1">
            Correct Answer
          </label>
          <input
            type="text"
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-[#AED8D7] rounded-lg focus:ring-2 focus:ring-[#5DA89B] focus:border-transparent"
          />
        </div>

        {/* Submit button spans both columns */}
        <button
          type="submit"
          className="col-span-1 lg:col-span-2 py-3 bg-gradient-to-r from-[#5DA89B] to-[#00304D] text-white font-semibold rounded-lg shadow-md hover:from-[#4b9e87] hover:to-[#022029] transition"
        >
          Add Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
