import { useState } from "react";
import HoardingStatus from "../utils/HoardingStatus";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Approved = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [appliedFromDate, setAppliedFromDate] = useState<Date>();
  const [appliedToDate, setAppliedToDate] = useState<Date>();

  const filterByDate = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const resetDateFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setAppliedFromDate(undefined);
    setAppliedToDate(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search hoarding..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>From date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>To date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={filterByDate}>Apply Filter</Button>
          <Button variant="outline" onClick={resetDateFilter}>Reset</Button>

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
      </div>

      <HoardingStatus
        searchQuery={searchQuery}
        status="approved"
        sort={sort}
        fromDate={appliedFromDate}
        toDate={appliedToDate}
      />
    </div>
  );
};

export default Approved;