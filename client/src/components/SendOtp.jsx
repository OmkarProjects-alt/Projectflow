import React, { useState, useRef } from 'react'
import { verifyOtp } from '../services/auth.service';
import { reSendOtp } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const SendOtp = ({ email, SendMessage, onCloseOtp }) => {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const otpInputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const { setUserData } = useUserContext();
    const navigate = useNavigate();


    const handleOtpChange = (index, value) => {
        if(!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if(value && index < 5) {
            otpInputRef.current[index + 1]?.focus();
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if(e.key === 'Backspace' && index > 0 && !otp[index]) {
            otpInputRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async() => {
        const OTP = otp.join("");
        console.log("My otp", OTP)
        if(OTP.toString().length !== 6) {
            SendMessage({ message:"Please enter a valid 6-digit OTP", success:false} );
            return;
        }

        try {
            setLoading(true)
            const res = await verifyOtp({
                email: email, 
                OTP: OTP
            });

            if(res.data.success) {
                SendMessage({message: "OTP Verified successfuly", success: true})
                setUserData(res.data.user);
                navigate('/projectflow/dashboard');
            }
            
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
            SendMessage({ message:error?.response?.data?.message || error.message, success: false })
        } finally {
            setLoading(false);
        }

    }

    const ReSendOtp = async () => {
        if(!email) {
            SendMessage({message: "email is not found, Please re-enter your email", success: false})
        }

        try {
            setLoading(true);
            const result = await reSendOtp({ email });

            if(result.data.success) {
                SendMessage({ message: result.data.message, success: true });
            }
        } catch (error) {
            SendMessage({ message: error?.response?.data?.message || error.message, success: false });
        } finally {
            setLoading(false);
        }
    }


  return (
    <div className='h-auto border border-[#8a8a8a] bg-neutral-900 w-full max-w-md rounded-2xl px-5 p-5'>
      <div className='flex flex-col items-center justify-center text-white'>
        <h1 className='text-2xl font-bold'>Verify your Email</h1>
        <div className='w-full p-3 mt-5'>
            <input 
                type="text"
                value={email}
                className='bg-neutral-800 outline-none text-white cursor-not-allowed h-10 w-full rounded-md pl-5'
            />
            <div className='flex flex-col items-center justify-center gap-3 mt-5'>
                <h1>We sent a 6-digit code to</h1>
                <h1>{email}</h1>

                <div className='grid grid-cols-6 gap-2'>
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            ref = {(el) => (otpInputRef.current[index] = el)}
                            type='text'
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className='rounded-md h-15 w-15 bg-neutral-700 outline-none text-center focus:border-2 border-green-500/50'
                        />
                    ))}
                </div>

                <div className='flex flex-col gap-3 w-full pt-3'>
                    <button
                        onClick={ReSendOtp}
                        className='flex items-end justify-end text-blue-400 hover:text-blue-300 cursor-pointer'
                    >
                        Resend OTP
                    </button>

                    {!loading ?(
                        <button
                            className='text-neutral-300 w-full p-2 bg-gradient-to-r from-green-500 to-green-400 cursor-pointer text-center h-10 rounded-2xl'
                            onClick={handleVerify}
                        >
                        Verify OTP
                        </button>
                    ) : (
                        <button
                            className='text-neutral-300 flex-1 p-2 bg-green-700 text-center h-10 rounded-2xl cursor-not-allowed flex items-center justify-center'
                        >
                            <span className='border-t-transparent border-2 rounded-full h-5 w-5 animate animate-spin'> </span>
                        </button>
                    )}
                </div>

                <div className='text-center flex gap-1'>
                    <p>
                        It's not my email 
                    </p>
                        <span 
                            className='text-blue-500 underline cursor-pointer'
                            onClick={() => onCloseOtp(false) }
                        > 
                            change
                        </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SendOtp
