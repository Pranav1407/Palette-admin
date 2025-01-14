import HoardingStatus from "../utils/HoardingStatus";

const Approved = () => {

  const sort = "newest";

  return (
    <div className="space-y-4">
      <HoardingStatus
        status="approved"
        sort={sort}
      />
    </div>
  );
};

export default Approved;