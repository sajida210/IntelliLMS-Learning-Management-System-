import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Fetch enrolled courses for a student
 * @param {string} studentId - The ID of the student
 * @returns {Promise<Array>} - List of enrolled courses
 */
export const getEnrolledCourses = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/enrolled`, {
      params: { studentId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
};

/**
 * Enroll a student in a course
 * @param {string} studentId - The ID of the student
 * @param {string} courseId - The ID of the course
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const enrollInCourse = async (studentId, courseId) => {
  try {
    await axios.post(`${API_BASE_URL}/enroll`, { studentId, courseId });
    return true;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return false;
  }
};
