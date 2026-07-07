import React, { useState, useEffect } from 'react'
import api from '../../utils/api';
import { register, login } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import SendOtp from '../../components/SendOtp';
import { useError } from '../../context/ErrorAndSuccessMsgContext';
import MessageAlert from '../../components/common/MessageAlert';
import { useUserContext } from '../../context/UserContext';

const Auth = () => {

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [enterOtp, setEnterOtp] = useState(false);
  const navigate = useNavigate();
  const { addMessage, clearMessage } = useError();
  const { setUserData } = useUserContext();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name] : e.target.value,
    })
  }

  const validator = () => {
    let newErrors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!user.email) {
      newErrors.push("Email address is required")
    } else if(!emailRegex.test(user.email)) {
      newErrors.push("Please enter a valid email address")
    }

    if (!user.password) {
      newErrors.push("Password is required");
    }

    if(!isLogin) {
      if(!user.name) {
        newErrors.push("Name is required");
      }

      if(!user.confirmPassword) {
        newErrors.push("Please confirm your password");
      }

      if(user.password !== user.confirmPassword) {
        newErrors.push("Password and Confirm password must be match");
      }

      let passwordRegex = /^.{8,}$/;

      if(!passwordRegex.test(user.password)) {
        newErrors.push("Password must be greater that 8 charectore");
      }
    }
    return newErrors;
  }

  const ClearData = () => {
    setUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setLoading(false);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    clearMessage();
    const validatorErrors = validator();
    if(validatorErrors.length > 0) {
      validatorErrors.forEach(error => {
        addMessage(error, false);
        return;
      });
      return
    }

    if(!isLogin) {
      try {
        setLoading(true);
        const res = await register({
          name: user.name,
          email: user.email,
          password: user.password
        });

        if(res.data.success) {
          setEnterOtp(true);
          console.log(res.data.message);
        }

      } catch (error) {
        console.log(error.response?.data?.message || `error message: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true)
        const res = await login({
          email: user.email,
          password: user.password
        });

        if(res.data.success) {
          setUserData(res.data.User);
          console.log("my data from back", res.data.User);
          ClearData();
          navigate('/projectflow/dashboard');
        }
      } catch (error) {
        addMessage(error?.response?.data?.message, false);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className='bg-[#0A0A0A] min-h-screen flex items-center justify-center px-5'>
      { <MessageAlert className='w-md' /> }
      {!enterOtp ? (
        <div className='h-auto border border-[#8a8a8a] bg-neutral-900 w-full max-w-md rounded-2xl px-5 p-5'>
          <h1 className='text-[#FAFAFA] text-center text-2xl font-bold'>
              Create an account to manage your projects
          </h1>

          <form onSubmit={handleSubmit} className='p-3 w-full space-y-4 pt-10' action="">
            <div className='grid grid-cols-1 gap-3'>

              {!isLogin && (
                <input 
                  className='bg-neutral-800 text-white rounded-xl outline-0 focus:border-2 h-10 border-purple-500 pl-5 '
                  type="text" 
                  placeholder='Enter Name'
                  name='name'
                  value={user.name}
                  onChange={handleChange}
                />
              )}

              <input 
                className='bg-neutral-800 text-white rounded-xl outline-0 focus:border-2 h-10 border-purple-500 pl-5 '
                type="text" 
                placeholder='Enter Email'
                name='email'
                value={user.email}
                onChange={handleChange}
              />

              <input 
                className='bg-neutral-800 text-white rounded-xl outline-0 focus:border-2 h-10 border-purple-500 pl-5 '
                type="password" 
                placeholder='Enter Password'
                name='password'
                value={user.password}
                onChange={handleChange}
              />

              {!isLogin && (
                <input 
                  className='bg-neutral-800 text-white rounded-xl outline-0 focus:border-2 h-10 border-purple-500 pl-5 '
                  type="password" 
                  placeholder='Enter Password'
                  name='confirmPassword'
                  value={user.confirmPassword}
                  onChange={handleChange}
                />
              )}
            </div>
            <div className='flex items-center gap-3 w-full pt-4'>
              {!loading ?(
                <button
                  className='text-neutral-300 flex-1 p-2 bg-purple-500 cursor-pointer text-center h-10 rounded-2xl'
                  type='submit'
                >
                  Submit
                </button>
              ) : (
                <button
                  className='text-neutral-300 flex-1 p-2 bg-purple-800 text-center h-10 rounded-2xl cursor-not-allowed flex items-center justify-center'
                >
                  <span className='border-t-transparent border-2 rounded-full h-5 w-5 animate animate-spin'> </span>
                </button>
              )}

              <button
                type='button'
                className='text-neutral-300 w-24 p-2 bg-[#A1A1AA] text-center cursor-pointer h-10 rounded-2xl'
                onClick={() => {ClearData()}}
              >
                Clear
              </button>
            </div>
          </form>
            <p className=' text-center text-white'>
              Already have an account?
              <span 
                className='text-sky-600 underline cursor-pointer' 
                onClick={() => 
                {setIsLogin(!isLogin)}}
              >
                {isLogin ? ' Register' : ' Login'}
              </span>
            </p>
        </div>
      ) : (
        <SendOtp 
          email= {user.email} 
          SendMessage = {(Message) => 
            addMessage(Message.message, Message.success)
          }
          onCloseOtp = {() => { setEnterOtp(false) }}
        />
      )}
    </div>
  )
}

export default Auth
