import HoardingStatus from "../utils/HoardingStatus";

const Pending = () => {
  const searchQuery = "";
  const sort = "";

  return (
    <div className="space-y-4">
      <HoardingStatus
        searchQuery={searchQuery}
        status="pending"
        sort={sort}
      />
    </div>
  );
};

export default Pending;