import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import toast from "react-hot-toast";

import { TiHome } from "react-icons/ti";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const Purchases = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        toast.error("Login First to View this page");
      }
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/purchases",
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );
        // console.log(response.data.courseData);
        setCourses(response.data.courseData);
        setLoading(false);
        // console.log(response.data.Courses);
      } catch (error) {
        setError(error.response.data.error);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/");
      setIsLogin(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.error || "Error in logging out");
    }
  };

  return (
    <div className="flex text-white w-full h-screen">
      {/* Sidebar - Fixed */}
      <aside className="h-screen fixed left-0 top-0 bg-gradient-to-b from-[#020024] via-[#090979] to-[#046ed1] w-[15%]">
        <div className="p-6 max-sm:px-2">
          <div className="mt-5 flex flex-wrap space-x-2 items-center justify-center">
            <img className="h-12 w-12 rounded-full" src={logo} alt="" />
          </div>

          <div className="mt-10 flex flex-col justify-center items-center">
            <nav>
              <NavLink to={"/"}>
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <TiHome className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Home</p>
                </div>
              </NavLink>

              <NavLink to="/courses">
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <FaDiscourse className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Courses</p>
                </div>
              </NavLink>

              <NavLink to={"/purchases"}>
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <FaDownload className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">
                    Purchases
                  </p>
                </div>
              </NavLink>

              <NavLink to={"/"}>
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <IoIosSettings className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Setting</p>
                </div>
              </NavLink>

              <NavLink onClick={handleLogout}>
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <IoLogOut className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Logout</p>
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-[85%] ml-[15%] h-screen">
        {/* Header - Fixed with Defined Height */}
        <header className="w-[85%] h-[80px] fixed top-0 z-10 flex items-center px-6 overflow-auto shadow-lg">
          <h1 className="text-2xl font-bold">Purchases</h1>
          <div className="flex gap-4 justify-center items-center ml-auto">
            <div className="flex">
              <input
                className="bg-transparent border rounded-tl-full rounded-bl-full px-4 py-1"
                type="text"
                placeholder="Type here to Search"
              />
              <FaSearch className="border h-auto w-auto px-3 rounded-tr-full rounded-br-full" />
            </div>
            <FaUserCircle className="h-[30px] w-[30px]" />
          </div>
        </header>

        {/* Scrollable Main Section */}
        <main className="p-4 mt-[80px] overflow-y-auto h-[calc(100vh-60px)]">
          {user ? (
            <>
              {loading ? (
                <p>Loading</p>
              ) : courses.length === 0 ? (
                <p>You have not access to any course</p>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {courses.map((course) => (
                    <div className="flex flex-col p-5 w-[300px] h-[500px] border hover:scale-105 duration-300 border-gray-600 bg-black justify-center items-center rounded-md">
                      <img
                        className="h-[200px] w-[200px] object-contain"
                        src={course.image.url}
                        alt=""
                      />
                      <div className="w-full">
                        <h1 className="text-lg font-semibold mb-2">
                          {course.title}
                        </h1>
                        <p className="text-sm text-gray-400">
                          The C Programming language is a general-purpose
                          procedural programming language
                        </p>
                      </div>
                      <div className="w-full flex justify-between items-center mt-7">
                        <h3 className="text-xl font-bold">
                          {" "}
                          &#x20b9; {course.price}{" "}
                        </h3>
                        <h4 className="text-green-500">20% off</h4>
                      </div>
                      <div className="w-full mt-7">
                        <Link
                          to={`/buy/${course._id}`}
                          className="px-4 py-2 hover:bg-blue-500 hover:shadow-amber-500 duration-300 bg-orange-500 rounded-lg border-orange-600"
                        >
                          Explore Course
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-red-500">{error}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Purchases;
