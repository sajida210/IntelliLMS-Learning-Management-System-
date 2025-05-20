// src/components/CourseList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useSearch } from "../context/SearchContext";

const CourseList = ({ userRole }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null); // for modal

  const { searchQuery } = useSearch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses/all")
      .then((res) => Array.isArray(res.data) ? setCourses(res.data) : setError("Failed to load courses."))
      .catch(() => setError("Failed to load courses."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (userRole !== "student" || !token) return;
    axios
      .get("http://localhost:5000/api/enroll/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = (res.data || []).map((c) => c?._id).filter(Boolean);
        setEnrolledCourseIds(ids);
      })
      .catch((err) => console.error("Error fetching enrolled:", err));
  }, [userRole, token]);

  const showDummyRazorpayPopup = () =>
    new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: "rzp_test_teBZfp3Iz4wU82",
        amount: 50000,
        currency: "INR",
        name: "LMS Dummy Payment",
        description: "This is a dummy simulation.",
        handler: (resp) => resolve(resp.razorpay_payment_id || "dummy"),
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      });
      rzp.open();
    });

  const handleEnroll = async (courseId) => {
    if (!token) {
      alert("Please log in to enroll.");
      return navigate("/login");
    }
    if (enrolledCourseIds.includes(courseId)) {
      return Swal.fire("Already Enrolled", "You’re already enrolled.", "info");
    }

    setEnrollingCourseId(courseId);
    try {
      const paymentId = await showDummyRazorpayPopup();
      await Swal.fire({
        icon: "success",
        title: "Payment Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      await axios.post(
        "http://localhost:5000/api/enroll",
        { courseId, paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const res = await axios.get("http://localhost:5000/api/enroll/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = (res.data || []).map((c) => c?._id).filter(Boolean);
      setEnrolledCourseIds(ids);
    } catch (err) {
      Swal.fire(
        "Enrollment Failed",
        err.message === "Payment cancelled"
          ? "Payment was cancelled."
          : "Enrollment failed.",
        "error"
      );
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
      Swal.fire("Deleted!", "Course deleted.", "success");
    } catch {
      setError("Failed to delete course.");
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EAF6F1] px-6 py-10">
      <h2
        style={{ fontFamily: "Franklin Gothic, serif" }}
        className="text-4xl font-semibold text-center text-[#063442] mb-8"
      >
        Available Courses
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-5">
        {filtered.map((course) => (
          <div
            key={course._id}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md transition-transform hover:scale-105 max-w-sm mx-auto flex flex-col"
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
              <p
                className="text-sm text-[#022029] mb-4 line-clamp-3 cursor-pointer"
                onClick={() => setSelectedCourse(course)}
                title="Click to read more"
              >
                {course.description}
              </p>

              {userRole === "admin" ? (
                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                    className="flex-1 bg-[#5DA89B] hover:bg-[#4b9e87] text-white py-2 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-[#063442] hover:bg-[#022029] text-white py-2 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEnroll(course._id)}
                  disabled={
                    enrolledCourseIds.includes(course._id) ||
                    enrollingCourseId === course._id
                  }
                  className={`mt-auto py-2 rounded-md text-white font-medium transition ${
                    enrolledCourseIds.includes(course._id)
                      ? "bg-[#AED8D7] cursor-not-allowed"
                      : enrollingCourseId === course._id
                      ? "bg-gray-300 cursor-wait"
                      : "bg-[#5DA89B] hover:bg-[#4b9e87]"
                  }`}
                >
                  {enrolledCourseIds.includes(course._id)
                    ? "Enrolled"
                    : enrollingCourseId === course._id
                    ? "Enrolling…"
                    : "Enroll"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-semibold mb-2 text-[#022029]">
              {selectedCourse.title}
            </h2>
            <p className="text-[#022029] text-sm">{selectedCourse.description}</p>
            <button
              className="absolute top-2 right-3 text-xl text-[#063442] hover:text-red-500"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="col-span-full text-center text-[#022029]">
          No courses match your search.
        </p>
      )}
    </div>
  );
};

export default CourseList;
