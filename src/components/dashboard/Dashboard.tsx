const Dashboard = () => {
  const dashboardStats = {
    availableHoardings: 24,
    bookedHoardings: 12,
    pendingHoardings: 6,
    approvedHoardings: 4,
    rejectedHoardings: 2,
    totalHoardings: 30,
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-secondary">Welcome to your hoarding management dashboard</p>
      </div>
      
      {/* Changed to 2 columns layout with bigger cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Hoardings - Featured Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-blue-100 mr-6">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Total Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.totalHoardings}</p>
            </div>
          </div>
        </div>

        {/* Available Hoardings */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-green-100 mr-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Available Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.availableHoardings}</p>
            </div>
          </div>
        </div>

        {/* Booked Hoardings */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-purple-100 mr-6">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Booked Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.bookedHoardings}</p>
            </div>
          </div>
        </div>

        {/* Approved Hoardings */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-yellow-100 mr-6">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Approved Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.approvedHoardings}</p>
            </div>
          </div>
        </div>

        {/* Pending Hoardings */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-orange-100 mr-6">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Pending Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.pendingHoardings}</p>
            </div>
          </div>
        </div>

        {/* Rejected Hoardings */}
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-red-100 mr-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-lg">Rejected Hoardings</p>
              <p className="text-4xl font-bold text-secondary">{dashboardStats.rejectedHoardings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;