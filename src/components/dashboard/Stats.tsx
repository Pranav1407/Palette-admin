const Stats = () => {
    return (
        <div className="flex justify-around bg-sidebar-20 rounded-lg">
            <div className="p-4 rounded-lg flex items-center gap-4">
                <span className="text-stat font-bold text-secondary">24</span>
                <div className="text-secondary text-lg">
                    <p>Hoardings</p>
                    <p>Available</p>
                </div>
            </div>

            <div className="p-4 rounded-lg flex items-center gap-4">
                <span className="text-stat font-bold text-secondary">12</span>
                <div className="text-secondary text-lg">
                    <p>Hoardings</p>
                    <p>Booked</p>
                </div>
            </div>

            <div className="p-4 rounded-lg flex items-center gap-4">
                <span className="text-stat font-bold text-secondary">56</span>
                <div className="text-secondary text-lg">
                    <p>Total</p>
                    <p>Customers</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;