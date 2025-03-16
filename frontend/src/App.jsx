import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {Toaster} from 'react-hot-toast' 
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";
import CourseCreate from "./admin/CourseCreate";

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const admin = JSON.parse(localStorage.getItem('admin'));
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={user ? <Purchases /> : <Navigate to={'/login'}/>} />

        {/* Admin routes */}
        <Route path="/admin/signup" element={<AdminSignup/>}></Route>
        <Route path="/admin/login" element={<AdminLogin/>}></Route>
        <Route path="/admin/dashboard" element={admin ? <Dashboard/> : <Navigate to={'/admin/login'}/>}></Route>
        <Route path="/admin/create-course" element={admin ? <CourseCreate/> : <Navigate to={'/admin/login'}/>}></Route>
        <Route path="/admin/our-courses" element={admin ? <OurCourses/> : <Navigate to={'/admin/login'}/>}></Route>
        <Route path="/admin/update-course/:id" element={admin ? <UpdateCourse/> : <Navigate to={'/admin/login'}/>}></Route>

      </Routes>
    </div>
  );
};

export default App;
