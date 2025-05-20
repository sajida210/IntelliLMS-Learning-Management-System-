import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CourseForm = ({ selectedCourse }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title);
      setDescription(selectedCourse.description);
      setVideoUrl(selectedCourse.videoUrl || "");
      setThumbnail(selectedCourse.thumbnail || "");
    }
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = { title, description, videoUrl, thumbnail };

    try {
      if (selectedCourse) {
        // Update Course
        await axios.put(`http://localhost:5000/api/courses/update/${selectedCourse._id}`, courseData);
        alert("Course updated successfully!");
      } else {
        // Add Course
        await axios.post("http://localhost:5000/api/courses/add", courseData);
        alert("Course added successfully!");
      }

      navigate("/view-course"); // Redirect after save
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {selectedCourse ? "Edit Course" : "Add Course"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {selectedCourse ? "Update Course" : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
