import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('user');
    if(token){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
  },[])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/course/courses",
          {
            withCredentials: true,
          }
        );
        setCourses(response.data.Courses);
        // console.log(response.data.Courses);
      } catch (error) {
        console.log("Error in fetchCourse", error);
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
      localStorage.removeItem('user');
      toast.success(response.data.message);
      setIsLogin(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.error || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="">
      <div className=" text-white  container mx-auto">
        {/* Header */}
        <header className="flex justify-between p-6">
          <div className="flex space-x-2 items-center justify-center">
            <img className="h-10 w-10 rounded-full" src={logo} alt="" />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
          </div>
          {isLogin ? (
            <>
              <div className="space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-x-4">
                <Link
                  to={"/login"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Signup
                </Link>
              </div>
            </>
          )}
        </header>

        {/* Main section 1*/}
        <section className="text-center py-20">
          <h1 className="text-4xl text-orange-500 font-semibold">
            CourseHaven
          </h1>
          <p className="text-gray-500 mt-7 mb-5">
            Sharpen Your Skills with courses crafted by experts.
          </p>
          <div className="space-x-3">
            <Link to={'/courses'} className="bg-green-500 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black px-6 py-3 ">
              Explore Courses
            </Link>
            <Link className=" hover:bg-green-500 hover:text-white rounded font-semibold bg-white duration-300 text-black px-6 py-3 ">
              Courses Videos
            </Link>
          </div>
        </section>

        {/* Main Section 2*/}
        <section>
          <Slider className="mb-20" {...settings}>
            {courses.map((course) => (
              <div kay={course._id} className="p-6">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded overflow-hidden">
                    <img
                      className="h-32 w-full object-contain "
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h1 className="text-xl font-bold text-white">
                        {course.title}
                      </h1>
                      <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* Footer */}
        <footer>
          <div className="grid mb-10 grid-cols-1 md:grid-cols-3 mt-10 gap-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex space-x-2 items-center justify-center">
                <img className="h-10 w-10 rounded-full" src={logo} alt="" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseHaven
                </h1>
              </div>

              <div className="mt-3">
                <p className="mb-2">Follow us</p>

                <div className="flex space-x-4">
                  <a
                    className="hover:text-blue-400 text-2xl duration-300"
                    href=""
                  >
                    <FaFacebook />
                  </a>
                  <a
                    className="hover:text-pink-600 text-2xl duration-300"
                    href=""
                  >
                    <FaInstagram />
                  </a>
                  <a
                    className="hover:text-blue-600 text-2xl duration-300"
                    href=""
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Connects</h3>
              <ul className="space-y-2 text-gray-400 text-center">
                <li className="hover:text-white duration-300 cursor-pointer">
                  Youtube- Learn Coding
                </li>
                <li className="hover:text-white duration-300 cursor-pointer">
                  Telegram- Learn Coding
                </li>
                <li className="hover:text-white duration-300 cursor-pointer">
                  Github- Learn Coding
                </li>
              </ul>
            </div>

            <div className="items-center md:items-end flex flex-col">
              <h3 className="text-lg font-semibold mb-3">
                copyrights &#169; 2024
              </h3>
              <ul className="space-y-2 text-gray-400 text-center md:text-right">
                <li className="hover:text-white duration-300 cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="hover:text-white duration-300 cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-white duration-300 cursor-pointer">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
