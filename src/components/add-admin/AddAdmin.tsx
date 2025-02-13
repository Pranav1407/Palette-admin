import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AddAdminProps } from "@/types/Types";
import { addAdmin } from "@/data/requests";
import toast from "react-hot-toast";

const AddAdmin = () =>{
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const [formData, setFormData] = useState<AddAdminProps>({
    username: "",
    email_id: "",
    password: "",
    phone_number: 0,
    role: "",
    terms: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "password") {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.role = isSuperAdmin ? "super_admin" : "admin";
    
    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await addAdmin(formData);
      if(response.message === "Sign up successful") {
        toast.success('Admin added successfully');
        formData.username = "";
        formData.email_id = "";
        formData.password = "";
        formData.phone_number = 0;
        formData.role = "";
        setIsSuperAdmin(false);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin. Please try again.')
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-10">
      <div className="w-full flex gap-2">
        <div className="w-1/2">
          <h2 className="text-lg mb-5 ml-2">Profile Details</h2>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="border border-gray-300 p-3 pl-6 rounded-xl w-full outline-none focus:outline-none"
            />
            <input
              type="email"
              name="email_id"
              required
              value={formData.email_id}
              onChange={handleInputChange}
              placeholder="Email"
              className="border border-gray-300 p-3 pl-6 rounded-xl w-full outline-none focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Password"
                className="border border-gray-300 p-3 pl-6 rounded-xl w-full outline-none focus:outline-none"
              />
              <button
                type="button"
                className="absolute top-3 right-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                required
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className={`border ${passwordError ? 'border-red-500' : 'border-gray-300'} p-3 pl-6 rounded-xl w-full outline-none focus:outline-none pr-10`}
              />
              <button
                type="button"
                className="absolute top-3 right-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="w-2/3">
                <h2 className="text-lg ">Super Admin</h2>
                <p className="mt-2 text-gray-600 text-sm">
                  Super Admins have the ability to add new admins. Please confirm
                  if you wish to grant this email Super Admin privileges.
                </p>
              </div>
              <input
                type="checkbox"
                id="super-admin"
                className="w-5 h-5 ml-2"
                checked={isSuperAdmin}
                onChange={() => setIsSuperAdmin(!isSuperAdmin)}
              />
            </div>

            <button type="submit" className="bg-sidebar text-white py-3 px-6 w-full rounded-xl mt-4 cursor-pointer">
              Save
            </button>
          </form>
        </div>

        <div className="w-1/2 flex justify-center items-center">
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
