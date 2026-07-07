import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { updateUserProfile } from "../../services/users.service";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import { useUserContext } from "../../context/UserContext";

const EditAndCreateProfileModal = ({ 
  open, 
  onClose,
  user
}) => {
const [loading, setLoading] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [isChanged, setIsChanged] = useState(false);
const [updatedUserData, setUpdatedUserData] = useState({});
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
  } else {
    setIsEditMode(false);
  }
}, [user, open]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    }

    setFormData(updatedData);

    const changeField = {}
    Object.keys(updatedData).forEach(key => {
       if(updatedData[key] !== originalData[key]) {
        changeField[key] = updatedData[key];
        return true;  
       }
    });
    console.log("changeField", changeField, "and", updatedUserData);
    setIsChanged(Object.keys(changeField).length > 0);
    console.log("hasChanged", isChanged );
    setUpdatedUserData(changeField);
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


  const validate = () => {
    if (!formData.about.trim()) {
      throw new Error("about is required");
    }
    if(!formData.about.trim().length > 100) {
      throw new Error("about must be less than 100 characters");
    }
    if (!formData.role.trim()) {
      throw new Error("Role is required");
    }
    if (!formData.skills.trim()) {
      throw new Error("Skills are required");
    }
    if (!formData.location.trim()) {
      throw new Error("Location is required");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {

      setLoading(true);

      if(isEditMode) {
        if("name" in updatedUserData && updatedUserData.name.trim() === "") {
            throw new Error("User name will not be null")
        }
        console.log("user data that are passing", updatedUserData)
        const result = await updateUserProfile(updatedUserData);

        if(result.data.success) {
          addMessage(result?.data?.message, true);
          setUserData(result.data.user);
        }
        
      } else {
        validate();
        const result = await updateUserProfile(formData);

        if(result.data.success) {
          addMessage(result?.data?.message, true);
          setUserData(result.data.user);
        }
      }

    } catch(error) {
      addMessage(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          bg-[#151b2770]
          w-full max-w-2xl
          border border-gray-800
          rounded-2xl
          shadow-2xl
          max-h-[80vh]
          flex
          flex-col
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? "Edit Profile" : "Create Profile"}
          </h2>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              hover:bg-gray-800
              text-neutral-400
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <form className="p-6 space-y-5">

            {isEditMode && (
              <div>
                <label className="block text-sm text-neutral-300 mb-2">
                  Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-lg resize-none bg-[#151b275e] text-white placeholder:text-[#6b6b6b] backdrop-blur-2xl border border-gray-700 focus:border-gray-900 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                About
              </label>

              <textarea
                rows={4}
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell people about yourself..."
                className="w-full px-4 py-3 rounded-lg resize-none bg-[#151b275e] text-white placeholder:text-[#6b6b6b] backdrop-blur-2xl border border-gray-700 focus:border-gray-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#151b275e] text-white placeholder:text-[#6b6b6b] backdrop-blur-2xl border border-gray-700 focus:border-gray-900 outline-none"
              >
                <option className="text-neutral-800" value="">Select Role</option>

                {roles.map((role, index) => (
                  <option key={index} value={role} className="text-neutral-800">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                className="w-full px-4 py-3 rounded-lg bg-[#151b275e] text-white placeholder:text-[#6b6b6b] backdrop-blur-2xl border border-gray-700 focus:border-gray-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter you location (City, state)"
                className="w-full px-4 py-3 rounded-lg bg-[#151b275e] text-white placeholder:text-[#6b6b6b] backdrop-blur-2xl border border-gray-700 focus:border-gray-900 outline-none"
              />
            </div>

          </form>
        </div>
        {/* Footer */}
        <div className=" z-40 flex items-center justify-end gap-3 py-4 px-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-700 text-neutral-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={(isEditMode && !isChanged) || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAndCreateProfileModal;
