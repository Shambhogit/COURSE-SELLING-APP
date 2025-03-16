import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'

const Buy = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState();
  const [error, setError] = useState();

  const [cardError, setCardError] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!user) {
        setError("Please login to purchase the courses");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:4000/api/v1/course/buy/${courseId}`,
          {},
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );
        // console.log(response);

        setClientSecret(response.data.clientSecret);
        setCourse(response.data.course);
        setLoading(false);

        // console.log(response);

        // toast.success(response.data.message || "Course purchased successfully");
        // navigate("/purchases");
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 400) {
          setError("You have already Purchased Course");
          // navigate("/purchases");
        } else {
          setError(error?.response?.data?.error || "Error");
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId]);

  const handlePurchase = async () => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      setError('Stripe or Element not found');
      console.log('Stripe Error');
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    setLoading(false);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log('cardelement not found');
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      // console.log('Stripe paymentMethod error', error);
      setLoading(false);
      setCardError(error.message);
    } else {
      // console.log('[PaymentMethod Created]', paymentMethod);
    }

    if(!clientSecret){
      console.log('No Cliend secret found');
      setLoading(false);
      return;
    }


    const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method:{
          card:card,
          billing_details:{
            name:user?.user?.firstName,
            email:user?.user?.email,
          }
        }
      }
    );
    if(confirmError){
      setCardError(confirmError.message);
    }else if(paymentIntent.status==='succeeded'){
      // console.log('Payment Succeeded', paymentIntent);
      // setCardError('Your Payment id : ', paymentIntent.id);
      // console.log(paymentIntent.id);
      const paymentInfo={
        email:user.user.email,
        userId:user.user._id,
        courseId:courseId,
        paymentId:paymentIntent.id,
        amount:paymentIntent.amount,
        status:paymentIntent.status
      };

      // console.log('Payment info : ', paymentInfo);
      await axios.post('http://localhost:4000/api/v1/order',paymentInfo,
        {
          headers:{
            Authorization:`Bearer ${user.token}`
          },
          withCredentials:true,
        }
      ).then(response=>{
        console.log(response.data);
      }).catch(error=>{
        console.log('error in making order');
      });
      toast.success("Payment Successful");
      navigate('/purchases');
    }
    setLoading(false);
  };

  return (
    <div>
    {
      error ? (
        error === "You have already Purchased Course" ? (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
              <p className="text-lg font-semibold">{error}</p>
              <Link 
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 duration-200 mt-3 flex items-center justify-center"
                to={'/purchases'}
              >
                Purchases
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
              <p className="text-lg font-semibold">{error}</p>
              <Link 
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 duration-200 mt-3 flex items-center justify-center"
                to={'/login'}
              >
                Login
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl text-white font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-300 text-sm"> Total Price</h2>
              <p className="text-red-500 font-bold">{course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-300 text-sm">Course Name</h2>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2" 
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424779',
                          "::placeholder": {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146'
                        },
                      },
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={!stripe || loading}
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {
                  cardError && (
                    <p className="text-red-500 font-semibold text-xs">
                      {cardError}
                    </p>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
  </div>
  
  );
};

export default Buy;
