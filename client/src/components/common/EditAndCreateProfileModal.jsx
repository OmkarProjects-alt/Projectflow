import React, { useState, useEffect } from "react";
import { X, Loader2, User, Info, Briefcase, Code, MapPin, Save, AlertCircle } from "lucide-react";
import { updateUserProfile } from "../../services/users.service";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import { useUserContext } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeProvider";
import ModalPortal from "./ModalPortal";

const EditAndCreateProfileModal = ({ 
  open, 
  onClose,
  user
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const { addMessage } = useError();
  const { user: currentUser, setUserData } = useUserContext();
  
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    role: "",
    skills: "",
    location: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    about: "",
    role: "",
    skills: "",
    location: "",
  });

  useEffect(() => {
    if (user) {
      const nextData = {
        name: user?.name || "",
        about: user?.about || "",
        role: user?.user_role || user?.role || "",
        skills: user?.skills || "",
        location: user?.location || "",
      };

      setFormData(nextData);
      setOriginalData(nextData);
      setIsEditMode(true);
      setUpdatedUserData({});
      setIsChanged(false);
      setErrors({});
      setTouched({});
    } else {
      setIsEditMode(false);
      setFormData({
        name: "",
        about: "",
        role: "",
        skills: "",
        location: "",
      });
      setOriginalData({
        name: "",
        about: "",
        role: "",
        skills: "",
        location: "",
      });
      setErrors({});
      setTouched({});
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    // Track changes for edit mode
    if (isEditMode) {
      const changeField = {};
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] !== originalData[key]) {
          changeField[key] = updatedData[key];
        }
      });
      setIsChanged(Object.keys(changeField).length > 0);
      setUpdatedUserData(changeField);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (fieldName) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case "about":
        if (!formData.about.trim()) {
          newErrors.about = "About is required";
        } else if (formData.about.trim().length > 200) {
          newErrors.about = "About must be less than 200 characters";
        } else {
          delete newErrors.about;
        }
        break;
      
      case "role":
        if (!formData.role.trim()) {
          newErrors.role = "Role is required";
        } else {
          delete newErrors.role;
        }
        break;
      
      case "skills":
        if (!formData.skills.trim()) {
          newErrors.skills = "Skills are required";
        } else if (formData.skills.trim().split(",").length > 20) {
          newErrors.skills = "Maximum 20 skills allowed";
        } else {
          delete newErrors.skills;
        }
        break;
      
      case "location":
        if (!formData.location.trim()) {
          newErrors.location = "Location is required";
        } else {
          delete newErrors.location;
        }
        break;
      
      case "name":
        if (isEditMode && !formData.name.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.about.trim()) {
      newErrors.about = "About is required";
    } else if (formData.about.trim().length > 200) {
      newErrors.about = "About must be less than 200 characters";
    }
    
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    
    if (!formData.skills.trim()) {
      newErrors.skills = "Skills are required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (isEditMode && "name" in updatedUserData && !updatedUserData.name.trim()) {
      newErrors.name = "Name cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      // Focus first field with error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const input = document.querySelector(`[name="${firstError}"]`);
        if (input) input.focus();
      }
      return;
    }

    try {
      setLoading(true);
      
      let dataToSubmit = {};
      
      if (isEditMode) {
        if (Object.keys(updatedUserData).length === 0) {
          addMessage("No changes to save", false);
          return;
        }
        dataToSubmit = updatedUserData;
      } else {
        dataToSubmit = formData;
      }

      const result = await updateUserProfile(dataToSubmit);

      if (result.data.success) {
        addMessage(result?.data?.message || "Profile updated successfully!", true);
        setUserData(result.data.user);
        onClose();
      }
    } catch(error) {
      addMessage(error?.response?.data?.message || error.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : "";
  };

  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "QA Engineer",
    "Software Tester",
    "UI/UX Designer",
    "Product Designer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "Cyber Security Engineer",
    "Database Administrator",
    "System Administrator",
    "Business Analyst",
    "Project Manager",
    "Product Manager",
    "Technical Writer",
  ];

  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/60
          backdrop-blur-md
          p-4
          animate-in
          fade-in
          duration-200
        "
        onClick={onClose}
      >
        <div
          className={`
            ${theme.card.primary}
            ${theme.border}
            w-full max-w-2xl
            rounded-2xl
            shadow-2xl
            shadow-black/50
            max-h-[90vh]
            flex
            flex-col
            overflow-hidden
            animate-in
            zoom-in-95
            duration-200
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            sticky top-0 
            flex items-center justify-between 
            p-6 
            border-b 
            ${theme.table.divider}
            bg-gradient-to-r
            from-purple-500/5
            to-blue-500/5
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg
                bg-blue-500/10
                ${theme.text.info}
              `}>
                {isEditMode ? <User size={20} /> : <User size={20} />}
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  {isEditMode ? "Edit Profile" : "Create Profile"}
                </h2>
                <p className={`text-xs ${theme.text.muted}`}>
                  {isEditMode ? "Update your personal information" : "Complete your profile setup"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`
                p-2
                rounded-lg
                ${theme.text.muted}
                hover:${theme.text.primary}
                hover:bg-gray-200/20
                dark:hover:bg-gray-800/50
                transition-all
                duration-200
              `}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-auto flex-1 p-6">
            <form className="space-y-5">
              {/* Name Field - Only in edit mode */}
              {isEditMode && (
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    <div className="flex items-center gap-2">
                      <User size={16} className={theme.text.muted} />
                      Full Name
                    </div>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name..."
                    className={`
                      w-full px-4 py-3
                      rounded-xl
                      ${theme.input.input}
                      ${theme.text.primary}
                      placeholder:${theme.text.muted}
                      border-2
                      transition-all
                      duration-200
                      ${getFieldError('name') 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : touched.name && !errors.name 
                          ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                          : theme.border + ' focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                      }
                    `}
                  />
                  {getFieldError('name') && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {getFieldError('name')}
                    </p>
                  )}
                </div>
              )}

              {/* About Field */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <div className="flex items-center gap-2">
                    <Info size={16} className={theme.text.muted} />
                    About
                  </div>
                </label>
                <textarea
                  rows={4}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell people about yourself..."
                  className={`
                    w-full px-4 py-3
                    rounded-xl
                    ${theme.input.textarea}
                    ${theme.text.primary}
                    placeholder:${theme.text.muted}
                    border-2
                    transition-all
                    duration-200
                    resize-none
                    ${getFieldError('about') 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : touched.about && !errors.about 
                        ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                        : theme.border + ' focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                    }
                  `}
                />
                <div className="flex justify-between mt-1">
                  {getFieldError('about') && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {getFieldError('about')}
                    </p>
                  )}
                  <span className={`text-xs ${theme.text.muted} ml-auto`}>
                    {formData.about.length}/200
                  </span>
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className={theme.text.muted} />
                    Role
                  </div>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    w-full px-4 py-3
                    rounded-xl
                    ${theme.input.select}
                    ${theme.text.primary}
                    border-2
                    transition-all
                    duration-200
                    cursor-pointer
                    appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                    bg-no-repeat
                    bg-[length:18px]
                    bg-[right_12px_center]
                    ${getFieldError('role') 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : touched.role && !errors.role 
                        ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                        : theme.border + ' focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                    }
                  `}
                >
                  <option className="text-neutral-800" value="">Select your role</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role} className="text-neutral-800">
                      {role}
                    </option>
                  ))}
                </select>
                {getFieldError('role') && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {getFieldError('role')}
                  </p>
                )}
              </div>

              {/* Skills Field */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <div className="flex items-center gap-2">
                    <Code size={16} className={theme.text.muted} />
                    Skills
                  </div>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="React, Node.js, PostgreSQL (comma separated)"
                  className={`
                    w-full px-4 py-3
                    rounded-xl
                    ${theme.input.input}
                    ${theme.text.primary}
                    placeholder:${theme.text.muted}
                    border-2
                    transition-all
                    duration-200
                    ${getFieldError('skills') 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : touched.skills && !errors.skills 
                        ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                        : theme.border + ' focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                    }
                  `}
                />
                {getFieldError('skills') && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {getFieldError('skills')}
                  </p>
                )}
                {formData.skills && !errors.skills && (
                  <p className="mt-1 text-xs text-gray-500">
                    Skills: {formData.skills.split(',').filter(s => s.trim()).length} added
                  </p>
                )}
              </div>

              {/* Location Field */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className={theme.text.muted} />
                    Location
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City, State or Country"
                  className={`
                    w-full px-4 py-3
                    rounded-xl
                    ${theme.input.input}
                    ${theme.text.primary}
                    placeholder:${theme.text.muted}
                    border-2
                    transition-all
                    duration-200
                    ${getFieldError('location') 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : touched.location && !errors.location 
                        ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                        : theme.border + ' focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                    }
                  `}
                />
                {getFieldError('location') && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {getFieldError('location')}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className={`
            sticky bottom-0
            flex items-center justify-end gap-3
            p-4 px-6
            border-t
            ${theme.table.divider}
            bg-gradient-to-r
            from-blue-500/5
            to-purple-500/5
          `}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`
                px-6 py-2.5
                rounded-xl
                ${theme.button.secondary}
                ${theme.text.secondary}
                hover:${theme.text.primary}
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                font-medium
              `}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={(isEditMode && !isChanged) || loading || Object.keys(errors).length > 0}
              className={`
                px-6 py-2.5
                rounded-xl
                bg-gradient-to-r
                from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                text-white
                font-medium
                transition-all
                duration-200
                flex items-center gap-2
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-blue-500/25
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                disabled:hover:shadow-none
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditMode ? "Save Changes" : "Create Profile"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default EditAndCreateProfileModal;