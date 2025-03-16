import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
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
      // console.log("Login Successful", response.data.message);
      // alert("Login successful");
      setEmail("");
      setPassword("");
      // console.log(response.data);
      toast.success(response.data.message);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/')
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
              to={"/signup"}
              className="bg-transparent text-white py-2 px-4 border border-white rounded"
            >
              Signup
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
          <p className="text-xs text-gray-400 mt-3">
            Login to access paid content!
          </p>
          <form className="mt-5" onSubmit={handleSubmit}>
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
                value="Login"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
