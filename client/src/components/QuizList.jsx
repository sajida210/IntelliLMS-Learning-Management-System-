import { useState } from "react";
import axios from "axios";

const QuizList = ({ quizzes }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  // Handle answer selection
  const handleSelectAnswer = (quizId, questionText, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [quizId]: { questionText, selectedAnswer: answer },
    });
  };

  // Handle quiz submission
  const handleSubmit = async (quizId) => {
    const selected = selectedAnswers[quizId];

    if (!selected || !selected.selectedAnswer) {
      alert("Please select an answer!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/quizzes/submit", {
        quizId,
        questionText: selected.questionText,
        selectedAnswer: selected.selectedAnswer,
      });

      setFeedback({
        ...feedback,
        [quizId]: response.data.correct ? "✅ Correct!" : "❌ Incorrect!",
      });

    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">Quiz List</h3>
      {quizzes.length > 0 ? (
        <ul className="space-y-6">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
              <strong className="text-xl font-bold text-gray-700">{quiz.title}</strong>

              {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="mt-4">
                  <p className="text-lg text-gray-800">{question.questionText}</p>

                  {/* Options */}
                  <div className="space-y-4 mt-2">
                    {question.options.map((option, index) => (
                      <label key={index} className="block text-gray-700">
                        <input
                          type="radio"
                          name={`quiz-${quiz._id}-${qIndex}`}
                          value={option}
                          checked={selectedAnswers[quiz._id]?.selectedAnswer === option}
                          onChange={() => handleSelectAnswer(quiz._id, question.questionText, option)}
                          className="mr-2 leading-tight"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleSubmit(quiz._id)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Submit
                    </button>
                  </div>

                  {/* Show feedback */}
                  {feedback[quiz._id] && (
                    <p className={`mt-2 font-semibold text-center text-lg ${feedback[quiz._id].includes("✅") ? 'text-green-500' : 'text-red-500'}`}>
                      {feedback[quiz._id]}
                    </p>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No quizzes available</p>
      )}
    </div>
  );
};

export default QuizList;
