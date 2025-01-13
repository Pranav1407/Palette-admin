import { ChevronDown, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const Header = () => {
    const [showPopover, setShowPopover] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        switch (path) {
            case '/':
                return 'Dashboard';
            case '/pending':
                return 'Pending';
            case '/approved':
                return 'Approved';
            case '/rejected':
                return 'Rejected';
            case '/chat':
                return '';
            case '/email-remainder':
                return 'Email Remainder';
            case '/add-admin':
                return 'Add Admin';
            default:
                if (path.startsWith('/hoarding/')) {
                    return 'Hoarding Detail';
                }
                return 'Dashboard';
        }
    };

    return(
        <header className="bg-white px-8 py-4 flex justify-between items-center relative">
            <div className="text-5xl text-sidebar-15 w-[90%] flex justify-between items-center">
                {getPageTitle()}
                {location.pathname !== '/chat' && (
                    <div className="flex items-center justify-center gap-2">
                        <div className="rounded-xl border border-[#D9D9D9] text-[#818181] text-lg font-normal p-3 flex items-center justify-center gap-2">
                            <Search size={26} />
                            <input type="text" placeholder="Search..." className="outline-none border-none pl-1 min-w-80" />
                        </div>
                        <div className="bg-sidebar rounded-[10px] flex items-center justify-center py-2 px-4 cursor-pointer">
                            <img src="/assets/icons/filter.svg" />
                        </div>
                    </div>
                )}
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
