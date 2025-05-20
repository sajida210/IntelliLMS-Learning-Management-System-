import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import uploadAnimation from "../assets/animations/upload.json";

const UploadCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: ""
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (courseId) {
      setIsEditMode(true);
      axios.get(`http://localhost:5000/api/courses/${courseId}`)
        .then((res) => {
          const { title, description, thumbnail, videoUrl } = res.data;
          setFormData({ title, description, thumbnail, videoUrl });
        })
        .catch((err) => {
          console.error("Error fetching course data:", err);
        });
    }
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isEditMode
      ? `http://localhost:5000/api/courses/${courseId}`
      : `http://localhost:5000/api/courses`;

    const method = isEditMode ? axios.put : axios.post;

    method(endpoint, formData)
      .then(() => {
        alert(`Course ${isEditMode ? "updated" : "created"} successfully`);
        navigate("/view-course");
      })
      .catch((err) => {
        console.error("Error submitting course:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF6F1] px-4 py-10 overflow-hidden">
      <div className="absolute top-5 left-5">
        <button
          onClick={() => navigate(`/view-course/${courseId || ""}`)}
          className="bg-[#AED8D7] text-[#00304D] px-3 py-1 rounded-lg hover:bg-[#adcdc4] transition"
        >
          ←
        </button>
      </div>

      <div className="max-w-4xl w-full flex rounded-3xl shadow-2xl overflow-hidden bg-[#063442]">
        {/* Left: Animation */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-[#00304D] text-[#AED8D7]">
          <div className="w-64 h-64 mb-4">
            <Lottie animationData={uploadAnimation} loop />
          </div>
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Course" : "Upload New Course"}
          </h2>
          <p className="text-sm text-center mt-2">
            Add or modify courses here!
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-1/2 p-10 bg-[#AED8D7] text-[#022029]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 font-medium">Course Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-[#022029] focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-[#022029] focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
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
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-[#022029] focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
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
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-[#022029] focus:outline-none focus:ring-2 focus:ring-[#0c202d]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#0d3349] hover:bg-[#063442] text-[#AED8D7] font-semibold transition duration-200"
            >
              {isEditMode ? "Update Course" : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCourse;
