const header = () => {
    return(
        <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src="/assets/logo.svg" alt="Logo" className="" />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-700 text-lg">Hi, Cody</span>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="/assets/profile.svg" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    )
}

export default header;