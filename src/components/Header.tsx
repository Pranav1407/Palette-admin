import { ChevronDown } from "lucide-react";

const header = () => {
    return(
        <header className="bg-white px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
                {/* <img src="/assets/logo.svg" alt="Logo" className="" /> */}
            </div>
            <div className="flex items-center gap-2 border-2 border-sidebar-15 px-2 py-2 rounded-[20px] cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="/assets/profile.svg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="text-sidebar" />
            </div>
        </header>
    )
}

export default header;