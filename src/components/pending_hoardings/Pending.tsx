import HoardingStatus from "../utils/HoardingStatus";

const Pending = () => {
  const sort = "";

  return (
    <div className="space-y-4">
      <HoardingStatus
        status="pending"
        sort={sort}
      />
    </div>
  );
};

export default Pending;