// src/components/ViewCourse.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

const ViewCourse = () => {
  const [courses, setCourses] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const userRole = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");
  const studentEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses/all")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Fetch courses failed:", err));
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleEnroll = async (course) => {
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }
    const options = {
      key: "rzp_test_6USh5wasq7E3gd",
      amount: 50000,
      currency: "INR",
      name: "LMS Enrollment",
      description: `Enroll for ${course.title}`,
      handler: async (response) => {
        try {
          setEnrollingCourseId(course._id);
          setTimeout(async () => {
            await axios.post("http://localhost:5000/api/enroll", {
              studentId,
              courseId: course._id,
              paymentId: response.razorpay_payment_id,
              studentEmail,
              courseTitle: course.title,
            });
            alert("Enrollment successful! Confirmation email sent.");
            navigate("/student-dashboard");
          }, 5000);
        } catch (err) {
          console.error("Enrollment failed:", err);
          alert("Enrollment failed. Please try again.");
        } finally {
          setEnrollingCourseId(null);
        }
      },
      prefill: { email: studentEmail },
      theme: { color: "#5DA89B" },
    };
    new window.Razorpay(options).open();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    }
  };

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EAF6F1] px-6 py-10">
      <h2
        style={{ fontFamily: "Franklin Gothic, serif" }}
        className="text-4xl font-semibold text-center text-[#063442] mb-8 tracking-tight"
      >
        Explore Courses
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-5">
        {filtered.map((course) => (
          <div
            key={course._id}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md transition-transform hover:scale-105 max-w-sm mx-auto"
          >
            <img
              src={course.thumbnail || "https://via.placeholder.com/400x200"}
              alt={course.title}
              className="w-full h-36 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#022029] mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-[#022029] mb-4 line-clamp-3">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {userRole === "admin" ? (
                  <>
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="bg-[#5DA89B] hover:bg-[#4b9e87] text-white px-4 py-2 text-sm rounded-full shadow-sm transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="bg-[#AED8D7] hover:bg-[#93c7c0] text-[#022029] px-4 py-2 text-sm rounded-full shadow-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-[#063442] hover:bg-[#022029] text-white px-4 py-2 text-sm rounded-full shadow-sm transition"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnroll(course)}
                    disabled={enrollingCourseId === course._id}
                    className={`${
                      enrollingCourseId === course._id
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#5DA89B] hover:bg-[#4b9e87]"
                    } text-white px-4 py-2 text-sm rounded-full shadow-sm transition`}
                  >
                    {enrollingCourseId === course._id
                      ? "Processing..."
                      : "Enroll"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-[#022029]">
            No courses match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;
