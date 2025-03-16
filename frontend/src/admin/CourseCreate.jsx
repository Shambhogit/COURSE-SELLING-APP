import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const changePhotoHandler = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      setImagePreview(reader.result);
      setImage(file);
    }
  }

  const handleCreateCourse = async (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    const admin = JSON.parse(localStorage.getItem('admin'));
    const token = admin.token;

    if(!token){
      navigate('/admin/login');
      return;
    }

    try{
      const response = await axios.post('http://localhost:4000/api/v1/course/create',
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
          withCredentials:true,
        }
      )
      console.log(response.data);
      toast.success('Courses Created Successfully');
      setTitle("");
      setPrice("");
      setDescription("");
      setImage("");
      setImagePreview("");
      navigate('/admin/our-courses');
    }catch(error){
      console.log(error);
      toast.error(error.response.data.error);
    }
  }

  return (
    <div className='min-h-screen py-10 text-white'>
      <div className='max-w-4xl mx-auto p-6 border rounded-lg shadow-lg'>
        <h3 className='text-2xl font-semibold mb-8'>Create Course</h3>

        <form onSubmit={handleCreateCourse} className='space-y-6'>
          <div className='space-y-2'>
            <label className='block text-lg'>Title</label>
            <input type="text"
            placeholder='Enter your Course title'
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className='w-full px-3 py-2 text-black border border-gray-400 rounded-md outline-none'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-lg'>Description</label>
            <input type="text"
            placeholder='Enter your Course Description'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className='w-full px-3 text-black py-2 border border-gray-400 rounded-md outline-none'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-lg'>Price</label>
            <input type="text"
            placeholder='Enter your Course Price'
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            className='w-full px-3 py-2 text-black border border-gray-400 rounded-md outline-none'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-lg'>Course Image</label>
            <img type="text"
            src={imagePreview ? `${imagePreview}` : '/imgPL.webp'}
            alt='image'
            className='w-full max-w-sm h-auto rounded-md object-cover'
            />
          </div>
          <input type="file"
          onChange={changePhotoHandler}
          className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
          />

          <button type='submit'
          className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200'>
            Create Course
          </button>
        </form>
      </div>
    </div>
  )
}

export default CourseCreate