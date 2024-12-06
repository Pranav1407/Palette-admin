import { NavLink } from 'react-router-dom'
import { MdDashboard, MdErrorOutline, MdOutlineCheckCircleOutline, MdEmail, MdPersonAdd, MdOutlineAccessTime  } from 'react-icons/md'

const Sidebar = () => {
    return (
        <div className="flex p-4">
            <aside className="w-64 bg-sidebar-30 text-secondary font-normal rounded-lg">
                <nav className="py-4">
                    <ul className="space-y-2 text-md">
                        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <MdDashboard size={25} />
                            <span>Dashboard</span>
                        </NavLink>
                        
                        <NavLink to="/all-hoardings" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <img src="/assets/icons/all-hoarding.svg" alt="All Hoardings" className="w-6 h-6" />
                            <span>All hoardings</span>
                        </NavLink>
                        
                        <NavLink to="/pending" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <MdOutlineAccessTime size={25} />
                            <span>Pending</span>
                        </NavLink>
                        
                        <NavLink to="/approved" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <MdOutlineCheckCircleOutline size={25} />
                            <span>Approved</span>
                        </NavLink>
                        
                        <NavLink to="/rejected" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <MdErrorOutline size={25} />
                            <span>Rejected</span>
                        </NavLink>
                        
                        <div className="h-px bg-secondary mx-4 my-2"></div>
                        
                        <NavLink to="/email-remainder" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
                            <MdEmail size={25} />
                            <span>Email remainder</span>
                        </NavLink>
                        
                        <NavLink to="/add-admin" className={({ isActive }) => `flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary ${isActive ? 'bg-white/30 border-l-8 border-secondary' : ''}`}>
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