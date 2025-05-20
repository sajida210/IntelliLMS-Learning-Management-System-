import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CertificateGenerator = () => {
  const { courseId } = useParams();
  const [name, setName] = useState("");
  const [eligible, setEligible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    axios.get(`http://localhost:5000/api/progress/student/${studentId}`)
      .then(({ data }) => {
        const courseEntries = data.filter(e => e.courseId === courseId);
        const avg = courseEntries.reduce((sum, e) => sum + e.progress, 0) / courseEntries.length || 0;
        setEligible(avg >= 100);
      })
      .catch(() => setEligible(false));
  }, [courseId]);

  const handleDownload = async () => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      const resp = await axios.post(
        "http://localhost:5000/api/certificates/generate",
        { studentId, courseId, studentName: name },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${courseId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to generate certificate");
    }
  };

  if (!eligible) {
    return <p className="p-6 text-center text-red-600">You must complete all quizzes to 100% to get a certificate.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Download Your Certificate</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleDownload}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Download PDF Certificate
      </button>
    </div>
  );
};

export default CertificateGenerator;
