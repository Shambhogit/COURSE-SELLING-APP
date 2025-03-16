import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import toast from "react-hot-toast";

import { TiHome } from "react-icons/ti";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";


const Dashboard = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);



  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      navigate("/admin/signup");
      setIsLogin(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.error || "Error in logging out");
    }
  };


  return (
    <div className="flex text-white w-full h-screen">
      {/* Sidebar - Fixed */}
      <aside className="h-screen border-r border-gray-500 fixed left-0 top-0 bg-gradient-to-b from-[#020024] via-[#090979] to-[#046ed1] w-[15%]">
        <div className="p-6 max-sm:px-2">
          <div className="mt-5 flex flex-wrap space-x-2 items-center justify-center">
            <img className="h-12 w-12 rounded-full" src={logo} alt="" />
          </div>

          <div className="mt-10 flex flex-col justify-center items-center">
            <nav>
              <NavLink
                to={"/admin/dashboard"}
              >
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <TiHome className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Home</p>
                </div>
              </NavLink>

              <NavLink
                to="/admin/our-courses"
              >
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <FaDiscourse className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">Our Courses</p>
                </div>
              </NavLink>

              <NavLink

              to='/admin/create-course'
              
              >
                <div className="flex gap-2 mt-6 duration-300 transition-all hover:scale-125">
                  <FaDownload className="text-2xl max-md:text-3xl max-sm:text-3xl" />
                  <p className="text-xl inline-block max-md:hidden">
                    Create Course
                  </p>
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
        <header className="w-[85%] h-[80px] fixed top-0 border-b border-gray-500 z-10 flex items-center px-6 overflow-auto shadow-lg">
          <h1 className="text-2xl font-bold">Dashboard Home</h1>
        </header>

        {/* Scrollable Main Section */}
        <main className="p-4 mt-[80px] overflow-y-auto h-[calc(100vh-60px)]">
          <div className="h-full w-full flex justify-center items-center">
            <p>Welcome!!!</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
