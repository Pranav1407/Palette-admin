import { NavLink } from 'react-router-dom'
import { MdDashboard, MdErrorOutline, MdOutlineCheckCircleOutline, MdEmail, MdPersonAdd, MdOutlineAccessTime  } from 'react-icons/md'

const Sidebar = () => {
    return (
        <div className="flex p-4">
            <aside className="w-60 bg-sidebar-15 text-sidebar font-normal rounded-[20px] px-4">
                <div className="flex items-center justify-center py-4">
                    <img src="/assets/Logo.png" alt="Logo" />
                </div>
                <nav className="py-4">
                    <ul className="space-y-2 text-md">
                        <NavLink to="/" className={({ isActive }) => `flex gap-3 py-2 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                            <MdDashboard size={25} />
                            <span>Dashboard</span>
                        </NavLink>
                        
                        {/* <NavLink to="/all-hoardings" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <img src="/assets/icons/all-hoarding.svg" alt="All Hoardings" className="w-6 h-6" />
                            <span>All hoardings</span>
                        </NavLink> */}
                        
                        <NavLink
                            to="/pending" 
                            className={({ isActive }) => {
                                return `flex gap-3 py-3 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`;
                            }}
                        >
                            <MdOutlineAccessTime size={25} />
                            <span>Pending</span>
                        </NavLink>
                        
                        <NavLink to="/approved" className={({ isActive }) => `flex gap-3 py-3 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                            <MdOutlineCheckCircleOutline size={25} />
                            <span>Approved</span>
                        </NavLink>
                        
                        <NavLink to="/rejected" className={({ isActive }) => `flex gap-3 py-3 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                            <MdErrorOutline size={25} />
                            <span>Rejected</span>
                        </NavLink>
                        
                        <div className="h-px bg-sidebar-30 mx-1 my-2"></div>
                        
                        <NavLink to="/email-remainder" className={({ isActive }) => `flex gap-3 py-3 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                            <MdEmail size={25} />
                            <span>Email remainder</span>
                        </NavLink>
                        
                        <NavLink to="/add-admin" className={({ isActive }) => `flex gap-3 py-3 pl-2 cursor-pointer ${isActive ? 'bg-white text-secondary rounded-lg' : ''}`}>
                            <MdPersonAdd size={25} />
                            <span>Add admin</span>
                        </NavLink>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default Sidebar