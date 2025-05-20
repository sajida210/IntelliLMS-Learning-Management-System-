import { useState } from "react";
import axios from "axios";

const StudentQuizList = ({ quizzes }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  // ✅ Handle Answer Selection
  const handleSelectAnswer = (quizId, questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: answer,
      },
    }));
  };

  // ✅ Handle Quiz Submission
  const handleSubmit = async (quizId, questions) => {
    const answers = selectedAnswers[quizId];

    if (!answers || Object.keys(answers).length !== questions.length) {
      alert("⚠️ Please select an answer for all questions!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/quizzes/submit", {
        quizId,
        responses: Object.keys(answers).map((questionId) => ({
          questionId,
          selectedAnswer: answers[questionId],
        })),
      });

      setFeedback((prev) => ({
        ...prev,
        [quizId]: response.data.feedback,
      }));
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h3 className="text-2xl font-semibold text-center text-gray-800">Available Quizzes</h3>

      {quizzes.length > 0 ? (
        <ul className="space-y-6">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-card">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <strong className="text-xl text-gray-800">{quiz.title || "Untitled Quiz"}</strong>
                </div>

                {/* Flashcard style questions */}
                <div className="space-y-4 p-4">
                  {quiz.questions.map((question) => (
                    <div key={question._id} className="flashcard bg-gray-100 p-4 rounded-lg shadow-md">
                      <p className="font-semibold text-gray-700">{question.questionText}</p>

                      {/* Render Options */}
                      {question.options && question.options.length > 0 ? (
                        <div className="space-y-2 mt-4">
                          {question.options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`quiz-${quiz._id}-question-${question._id}`}
                                value={option}
                                checked={selectedAnswers[quiz._id]?.[question._id] === option}
                                onChange={() => handleSelectAnswer(quiz._id, question._id, option)}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-red-500">⚠️ No options available for this question.</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="p-4 text-center">
                  <button
                    onClick={() => handleSubmit(quiz._id, quiz.questions)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Submit Quiz
                  </button>
                </div>

                {/* Feedback */}
                {feedback[quiz._id] && (
                  <div className="p-4 bg-green-100 rounded-lg mt-4 text-center">
                    <p className="text-green-700">{feedback[quiz._id]}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-red-500">⚠️ No quizzes available.</p>
      )}
    </div>
  );
};

export default StudentQuizList;
