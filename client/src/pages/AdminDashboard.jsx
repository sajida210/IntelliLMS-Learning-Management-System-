// components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../context/SearchContext";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseStudentData, setCourseStudentData] = useState({});
  const [loading, setLoading] = useState(true);

  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/students"),
          axios.get("http://localhost:5000/api/courses/all"),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);

        const courseData = {};
        await Promise.all(
          coursesRes.data.map(async (course) => {
            try {
              const res = await axios.get(
                `http://localhost:5000/api/courses/${course._id}/students`
              );
              courseData[course._id] = res.data;
            } catch {
              courseData[course._id] = { numberOfStudents: 0, students: [] };
            }
          })
        );
        setCourseStudentData(courseData);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const titleMatch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const enrolled = courseStudentData[course._id]?.students || [];
    const studentMatch = enrolled.some((email) =>
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatch || studentMatch;
  });

  return (
    <div className="min-h-screen bg-[#EAF6F1] py-8 px-6 sm:px-8 lg:px-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto bg-[#ffffff] p-8 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-[#063442] mb-6">
          Admin Dashboard
        </h2>

        {loading ? (
          <p className="text-center text-[#022029]">Loading data…</p>
        ) : (
          <div className="bg-[#ffffff] p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-[#063442] mb-6">
              Courses and Enrolled Students
            </h3>

            {filteredCourses.length ? (
              <div className="overflow-x-auto rounded-lg shadow-lg border border-[#AED8D7]">
                <table className="min-w-full bg-[#ffffff] table-auto">
                  <thead>
                    <tr className="text-sm text-[#022029] font-medium">
                      <th className="py-3 px-6 text-left border-b border-[#AED8D7]">
                        Course Title
                      </th>
                      <th className="py-3 px-6 text-left border-b border-[#AED8D7]">
                        Number of Students
                      </th>
                      <th className="py-3 px-6 text-left border-b border-[#AED8D7]">
                        Enrolled Students
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#022029]">
                    {filteredCourses.map((course) => {
                      const data = courseStudentData[course._id] || {
                        numberOfStudents: 0,
                        students: [],
                      };
                      return (
                        <tr
                          key={course._id}
                          className="hover:bg-[#AED8D7] cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                          <td className="py-4 px-6 border-b text-[#022029]">
                            {course.title}
                          </td>
                          <td className="py-4 px-6 border-b text-[#022029]">
                            {data.numberOfStudents}
                          </td>
                          <td className="py-4 px-6 border-b text-[#022029]">
                            {data.students.length ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {data.students.map((email, i) => (
                                  <li key={i} className="text-sm text-[#022029]">
                                    {email}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-[#5DA89B]">
                                No students enrolled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-[#022029]">
                No matching courses or students found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
