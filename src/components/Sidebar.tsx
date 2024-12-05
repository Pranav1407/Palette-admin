import { MdDashboard, MdPeople, MdErrorOutline, MdOutlineCheckCircleOutline, MdEmail, MdPersonAdd } from 'react-icons/md'

const sidebar = () => {
    return (
        <div className="flex p-4">
            <aside className="w-64 bg-sidebar-30 text-secondary font-normal rounded-lg">
                <nav className="py-4">
                    <ul className="space-y-2 text-md">
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdDashboard size={25} />
                            <span>Dashboard</span>
                        </li>
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <img src="/assets/icons/all-hoarding.svg" alt="All Hoardings" className="w-6 h-6" />
                            <span>All hoardings</span>
                        </li>
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdOutlineCheckCircleOutline size={25} />
                            <span>Approved</span>
                        </li>
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdErrorOutline size={25} />
                            <span>Rejected</span>
                        </li>
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdPeople size={25} />
                            <span>Customers</span>
                        </li>
                        
                        <div className="h-px bg-secondary mx-4 my-2"></div>
                        
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdEmail size={25} />
                            <span>Email remainder</span>
                        </li>
                        <li className="flex items-center gap-3 py-3 px-10 cursor-pointer hover:bg-white/30 hover:border-l-8 hover:border-secondary">
                            <MdPersonAdd size={25} />
                            <span>Add admin</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default sidebar