import HoardingStatus from "../utils/HoardingStatus";

const Approved = () => {

  const searchQuery = "";
  const sort = "newest";

  return (
    <div className="space-y-4">
      <HoardingStatus
        searchQuery={searchQuery}
        status="approved"
        sort={sort}
      />
    </div>
  );
};

export default Approved;