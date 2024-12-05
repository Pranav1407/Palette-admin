import HoardingStatus from "./HoardingStatus"
import Stats from "./Stats"

const dashboard = () => {
  return (
    <div className="h-full flex flex-col">
      <Stats />
      <HoardingStatus />
    </div>
  )
}

export default dashboard