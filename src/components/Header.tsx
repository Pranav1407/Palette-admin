import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const Header = () => {
    const [showPopover, setShowPopover] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

    return(
        <header className="bg-white px-8 py-4 flex justify-between items-center relative">
            <div className="flex items-center">
                {/* <img src="/assets/logo.svg" alt="Logo" className="" /> */}
            </div>
            <div className="relative">
                <div 
                    className="flex items-center gap-2 border-2 border-sidebar-15 px-2 py-2 rounded-[20px] cursor-pointer"
                    onClick={() => setShowPopover(!showPopover)}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src="/assets/profile.svg" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <ChevronDown className="text-sidebar" />
                </div>
                
                {showPopover && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                        <button 
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header;
