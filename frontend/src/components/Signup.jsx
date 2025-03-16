import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e.target);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/signup",
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');

      toast.success(response.data.message);

      navigate('/login');

    } catch (error) {
      if(error.response){
        setErrorMessage(error.response.data.error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center p-6 text-white flex-col">
      <div className="container">
        {/* Header */}
        <header className="flex flex-row justify-between">
          <div className="flex space-x-2 items-center justify-center">
            <img className="h-10 w-10 rounded-full" src={logo} alt="" />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
          </div>

          <div className="space-x-4">
            <Link
              to={"/login"}
              className="bg-transparent text-white py-2 px-4 border border-white rounded"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="bg-orange-500 text-white py-2 px-4 rounded"
            >
              Join now
            </Link>
          </div>
        </header>
      </div>

      {/* Login from */}

      <div className="container flex justify-center items-center">
        <div className="flex w-[400px] border border-gray-700 flex-col justify-center mt-40 items-center rounded-md bg-gray-900 px-5 py-5">
          <h1 className="text-xl">
            Welcome to{" "}
            <span className="text-orange-500 font-semibold">CourseHaven</span>
          </h1>
          <p className="text-xs text-gray-400 mt-3">Just Signup To Join us!</p>
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-xs mb-2 text-gray-300 mt-3">First Name</p>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-[300px] bg-gray-800 p-2 rounded-md border border-zinc-500"
                type="text"
                placeholder="Type Your Name"
                required
              />
            </div>

            <div className="mb-4">
              <p className="text-xs mb-2 text-gray-300 mt-3">Last Name</p>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-[300px] bg-gray-800 p-2 rounded-md border border-zinc-500"
                type="text"
                placeholder="Type Your Name"
                required
              />
            </div>

            <div className="mb-4">
              <p className="text-xs mb-2 text-gray-300 mt-3">Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[300px] bg-gray-800 p-2 rounded-md border border-zinc-500"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <p className="text-xs mb-2 text-gray-300 mt-3">Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[300px] bg-gray-800 p-2 rounded-md border border-zinc-500"
                type="password"
                placeholder="Password"
                required
              />
            </div>


            <div className="text-center w-[300px]">
              <p className="text-xs mb-2 text-red-500 mt-3">{errorMessage}</p>
            </div>


            <div className="mb-4">
              <input
                className="w-[300px] bg-orange-500 p-2 rounded-md hover:bg-blue-500 duration-300 transition-all"
                type="submit"
                value="Signup"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
