import HoardingStatus from "../utils/HoardingStatus";

const Rejected = () => {
  const sort = "";

  return (
    <div className="space-y-4">
      <HoardingStatus
        status="rejected"
        sort={sort}
      />
    </div>
  );
};

export default Rejected;