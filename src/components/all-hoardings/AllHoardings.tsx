import HoardingStatus from "../utils/HoardingStatus"
import { useState } from "react"
import { Input } from "@/components/ui/input";

const AllHoardings = () => {
    const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search hoarding..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <HoardingStatus
        searchQuery={searchQuery}
        status=""
      />
    </div>
  )
}

export default AllHoardings