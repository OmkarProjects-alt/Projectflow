import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { register, login } from '../../services/auth.service';
import SendOtp from '../../components/SendOtp';
import { useError } from '../../context/ErrorAndSuccessMsgContext';
import MessageAlert from '../../components/common/MessageAlert';
import { useUserContext } from '../../context/UserContext';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [enterOtp, setEnterOtp] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  
  const navigate = useNavigate();
  const { addMessage, clearMessage } = useError();
  const { setUserData, verifySession } = useUserContext();
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await verifySession();
        if (res.data.success) {
          setUserData(res.data.user);
          navigate("/projectflow/dashboard", { replace: true });
          return;
        }
      } catch (_) {
        // Session invalid
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate, setUserData, verifySession]);

  // Validation on change

  const getValidationErrors = () => {
      const errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!user.email) errors.email = "Email is required";
      else if (!emailRegex.test(user.email)) errors.email = "Please enter a valid email";

      if (!user.password) errors.password = "Password is required";
      else if (user.password.length < 8) errors.password = "Password must be at least 8 characters";

      if (!isLogin) {
        if (!user.name) errors.name = "Name is required";
        if (!user.confirmPassword) errors.confirmPassword = "Please confirm your password";
        else if (user.password !== user.confirmPassword) errors.confirmPassword = "Passwords don't match";
      }

      return errors;
  };

  useEffect(() => {
    const errors = getValidationErrors();
    setIsValid(Object.keys(errors).length === 0);
  }, [user, isLogin]);

  const errors = getValidationErrors();

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

   const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(user.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!user.password) {
      errors.password = "Password is required";
    } else if (user.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!user.name) {
        errors.name = "Name is required";
      }
      if (!user.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (user.password !== user.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    return errors;
  };
 

  const validator = () => {
    clearMessage();
    const errors = validateForm();
    const errorMessages = Object.values(errors);
    
    if (errorMessages.length > 0) {
      errorMessages.forEach(error => addMessage(error, false));
      return false;
    }
    return true;
  };

  const ClearData = () => {
    setUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setTouched({});
    setLoading(false);
    clearMessage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validator()) return;

    try {
      setLoading(true);
      clearMessage();

      if (!isLogin) {
        // Register
        const res = await register({
          name: user.name,
          email: user.email,
          password: user.password
        });

        if (res.data.success) {
          setEnterOtp(true);
          addMessage("Verification code sent to your email!", true);
        }
      } else {
        // Login
        const res = await login({
          email: user.email,
          password: user.password
        });

        if (res.data.success) {
          setUserData(res.data.User);
          addMessage("Welcome back! 🎉", true);
          ClearData();
          setTimeout(() => navigate('/projectflow/dashboard'), 500);
        }
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Something went wrong";
      addMessage(message, false);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const base = `
      w-full
      bg-neutral-800/50
      text-white
      rounded-xl
      outline-none
      border-2
      pl-11
      pr-10
      py-2.5
      transition-all
      duration-200
      placeholder:text-gray-500
      focus:border-purple-500
      focus:ring-2
      focus:ring-purple-500/20
      hover:bg-neutral-800
    `;

    if (!touched[fieldName]) return `${base} border-transparent`;

    const errors = getValidationErrors(); // pure, no state updates
    if (errors[fieldName]) {
      return `${base} border-red-500/50 focus:border-red-500 focus:ring-red-500/20`;
    }
    return `${base} border-green-500/50 focus:border-green-500 focus:ring-green-500/20`;
  };

  if (enterOtp) {
    return (
      <SendOtp 
        email={user.email} 
        SendMessage={(msg) => addMessage(msg.message, msg.success)}
        onCloseOtp={() => setEnterOtp(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Message Alert */}
        <div className="mb-4">
          <MessageAlert className="w-full" />
        </div>

        {/* Auth Card */}
        <div className="
          relative
          bg-neutral-900/90
          backdrop-blur-xl
          border border-neutral-700/50
          rounded-2xl
          px-6 py-8
          shadow-2xl
          shadow-purple-500/5
          transition-all
          duration-300
          hover:shadow-purple-500/10
        ">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="
              w-16 h-16
              mx-auto
              bg-gradient-to-br from-purple-500 to-purple-700
              rounded-2xl
              flex items-center justify-center
              mb-4
              shadow-lg shadow-purple-500/20
            ">
              {isLogin ? (
                <LogIn className="h-8 w-8 text-white" />
              ) : (
                <UserPlus className="h-8 w-8 text-white" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {isLogin 
                ? "Sign in to manage your projects" 
                : "Start managing your projects efficiently"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            {!isLogin && (
              <div className="relative">
                <User className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  transition-colors duration-200
                  ${touched.name && !errors.name ? 'text-green-400' : 'text-gray-400'}
                `} size={18} />
                
                <input
                  className={getInputClassName('name')}
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                
                {touched.name && !errors.name && user.name && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={18} />
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className={`
                absolute left-3 top-1/2 -translate-y-1/2
                transition-colors duration-200
                ${touched.email && !errors.email ? 'text-green-400' : 'text-gray-400'}
              `} size={18} />
              
              <input
                className={getInputClassName('email')}
                type="email"
                placeholder="Email Address"
                name="email"
                value={user.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              
              {touched.email && !errors.email && user.email && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={18} />
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              
              <input
                className={getInputClassName('password')}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                
                <input
                  className={getInputClassName('confirmPassword')}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {/* Password Hint */}
            {!isLogin && user.password && user.password.length < 8 && (
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                <AlertCircle size={12} />
                Password must be at least 8 characters
              </p>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !isValid}
                className={`
                  flex-1
                  px-6 py-2.5
                  rounded-xl
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  flex items-center justify-center
                  gap-2
                  ${loading || !isValid
                    ? 'bg-purple-800 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={ClearData}
                disabled={loading}
                className="
                  px-6 py-2.5
                  rounded-xl
                  bg-neutral-800
                  text-gray-400
                  hover:text-white
                  hover:bg-neutral-700
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Clear
              </button>
            </div>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  ClearData();
                }}
                className="
                  ml-2
                  text-purple-400
                  hover:text-purple-300
                  font-medium
                  transition-colors
                  duration-200
                  hover:underline
                "
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to our
              <button className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">
                Terms of Service
              </button>
              {' '}and{' '}
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;