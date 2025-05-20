import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import editAnimation from "../assets/animations/edit.json";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        setErrorMsg("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, formData);
      alert("✅ Course updated successfully!");
      navigate("/view-course");
    } catch (error) {
      console.error("Error updating course:", error);
      setErrorMsg("Failed to update course. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading course data...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF6F1] px-4 py-10 overflow-hidden">
      <div className="absolute top-5 left-5">
        <button
          onClick={() => navigate("/view-course")}
          className="bg-[#AED8D7] text-[#00304D] px-3 py-1 rounded-lg hover:bg-[#adcdc4] transition"
        >
          ←
        </button>
      </div>

      <div className="max-w-4xl w-full flex rounded-3xl shadow-2xl overflow-hidden bg-[#063442]">
        {/* Left: Animation */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-[#00304D] text-[#AED8D7]">
          <div className="w-64 h-64 mb-4">
            <Lottie animationData={editAnimation} loop />
          </div>
          <h2 className="text-xl font-semibold">Edit Course</h2>
          <p className="text-sm text-center mt-2">
            Modify course content or details here!
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-1/2 p-10 bg-[#AED8D7] text-[#022029]">
          {errorMsg && (
            <p className="text-red-600 mb-4 text-sm text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 font-medium">Course Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter course description"
                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">YouTube Video URL</label>
              <input
                type="text"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="Enter video URL"
                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#0d3349] hover:bg-[#063442] text-[#AED8D7] font-semibold transition duration-200"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
