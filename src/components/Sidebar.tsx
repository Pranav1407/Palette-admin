import { NavLink } from 'react-router-dom'
import { MdErrorOutline, MdOutlineCheckCircleOutline, MdPersonAdd, MdOutlineAccessTime, MdKeyboardArrowDown } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'
import { MessageSquare, PanelRightClose } from 'lucide-react'
import { useState } from 'react'

const Sidebar = () => {
    const [isHoardingOpen, setIsHoardingOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex p-4">
            <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 bg-sidebar-15 text-sidebar shadow-md shadow-sidebar-15 font-normal rounded-[20px] px-4`}>
                <div className="flex items-center justify-center py-4 cursor-pointer" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    {isSidebarCollapsed ? (
                        <PanelRightClose size={24} />
                    ) : (
                        <img src="/assets/Logo.png" alt="Logo" />
                    )}
                </div>
                <nav className="py-4">
                    <ul className="space-y-2 text-md">
                        <NavLink to="/"  className={({ isActive }) => 
                            `flex ${isSidebarCollapsed ? 'justify-center py-1' : 'gap-3 pl-2 py-2'} cursor-pointer ${
                                isActive ? 'bg-white text-secondary rounded-lg' : ''
                            }`}
                        >
                            <RxDashboard size={25} />
                            {!isSidebarCollapsed && <span>Dashboard</span>}
                        </NavLink>
                        <NavLink to="/chat"  className={({ isActive }) => 
                            `flex ${isSidebarCollapsed ? 'justify-center py-1' : 'gap-3 pl-2 py-2'} cursor-pointer ${
                                isActive ? 'bg-white text-secondary rounded-lg' : ''
                            }`}
                        >
                            <MessageSquare size={25} />
                            {!isSidebarCollapsed && <span>Chat</span>}
                        </NavLink>
                        <div className="relative">
                            <div 
                                onClick={() => setIsHoardingOpen(!isHoardingOpen)}
                                className={`flex justify-between items-center py-3 cursor-pointer ${isSidebarCollapsed ? 'justify-center pl-1' : 'gap-3 pl-2'}`}
                            >
                                <div className="flex gap-3">
                                    <RxDashboard size={25} />
                                    {!isSidebarCollapsed && <span>Hoarding</span>}
                                </div>
                                {!isSidebarCollapsed && (
                                    <MdKeyboardArrowDown 
                                        size={20} 
                                        className={`transition-transform duration-200 ${isHoardingOpen ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </div>
                            
                            {isHoardingOpen && (
                                <div className={`${isSidebarCollapsed ? 'ml-0' : 'ml-8'} space-y-2`}>
                                    <NavLink to="/pending"  className={({ isActive }) => 
                                        `flex ${isSidebarCollapsed ? 'justify-center py-1' : 'gap-3 pl-2 py-2'} cursor-pointer ${
                                            isActive ? 'bg-white text-secondary rounded-lg' : ''
                                        }`}
                                    >
                                        <MdOutlineAccessTime size={20} />
                                        {!isSidebarCollapsed && <span>Pending</span>}
                                    </NavLink>
                                    
                                    <NavLink to="/approved" className={({ isActive }) => `flex gap-3 py-2 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                                        <MdOutlineCheckCircleOutline size={20} />
                                        {!isSidebarCollapsed && <span>Approved</span>}
                                    </NavLink>
                                    
                                    <NavLink to="/rejected" className={({ isActive }) => `flex gap-3 py-2 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                                        <MdErrorOutline size={20} />
                                        {!isSidebarCollapsed && <span>Rejected</span>}
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-px bg-sidebar-30 mx-1 my-2"></div>
                        
                        {/* <NavLink to="/email-remainder" 
                             className={({ isActive }) => 
                                `flex ${isSidebarCollapsed ? 'justify-center py-1' : 'gap-3 pl-2 py-2'} cursor-pointer ${
                                    isActive ? 'bg-white text-secondary rounded-lg' : ''
                            }`}
                        >
                            <MdEmail size={25} />
                            {!isSidebarCollapsed && <span>Email remainder</span>}
                        </NavLink> */}
                        
                        <NavLink to="/add-admin" 
                             className={({ isActive }) => 
                                `flex ${isSidebarCollapsed ? 'justify-center py-1' : 'gap-3 pl-2 py-2'} cursor-pointer ${
                                    isActive ? 'bg-white text-secondary rounded-lg' : ''
                            }`}
                        >
                            <MdPersonAdd size={25} />
                            {!isSidebarCollapsed && <span>Add admin</span>}
                        </NavLink>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default Sidebar
