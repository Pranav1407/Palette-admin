import { useState } from "react";
import HoardingStatus from "../utils/HoardingStatus";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Pending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search hoarding..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">Sort by Time</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSort('asc')}>
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort('desc')}>
              Newest first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <HoardingStatus
        searchQuery={searchQuery}
        status="pending"
        sort={sort}
      />
    </div>
  );
};

export default Pending;