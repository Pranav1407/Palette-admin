import { RiAttachment2 } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"  
import { useQuery } from "@tanstack/react-query";
import { fetchHoardings } from "@/data/requests";

type HoardingStatusProps = {
  status: string;
  searchQuery: string;
  sort?: string;
  fromDate?: Date;
  toDate?: Date;
}

  const HoardingStatus = ({status, sort, searchQuery, fromDate, toDate}: HoardingStatusProps) => {

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const navigate = useNavigate()

    const {data, isError, error} = useQuery({
      queryKey: ["hoardings"],
      queryFn: () => fetchHoardings(status)
    })

    const hoardings = data ? data.payload.data : []
    const filteredAndSortedHoardings = hoardings
    .filter((item: any) => {
      const matchesSearch = item.current_status.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Create new Date objects for start and end of the selected days
      const itemDate = new Date(item.time);
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      
      // Set start date to beginning of day (00:00:00)
      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      
      // Set end date to end of day (23:59:59.999)
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }
      
      const isAfterFromDate = startDate ? itemDate >= startDate : true;
      const isBeforeToDate = endDate ? itemDate <= endDate : true;
      
      return matchesSearch && isAfterFromDate && isBeforeToDate;
    })

    .sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      
      if (sort === 'asc') {
        return dateA.getTime() - dateB.getTime();
      }
      return dateB.getTime() - dateA.getTime();
    });

    // Pagination logic
    
    const totalPages = filteredAndSortedHoardings ? Math.ceil(filteredAndSortedHoardings.length / itemsPerPage) : 0
    const paginatedHoardings = filteredAndSortedHoardings ? filteredAndSortedHoardings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : []

    const renderPaginationItems = () => {
        const items = [];
        const showEllipsisStart = currentPage > 3;
        const showEllipsisEnd = currentPage < totalPages - 2;
    
        for (let i = 1; i <= totalPages; i++) {
          if (
            i === 1 || // First page
            i === totalPages || // Last page
            (i >= currentPage - 1 && i <= currentPage + 1) // Pages around current
          ) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (i === 2 && showEllipsisStart) {
            items.push(
              <PaginationItem key="ellipsis-start">
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else if (i === totalPages - 1 && showEllipsisEnd) {
            items.push(
              <PaginationItem key="ellipsis-end">
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        }
        return items;
      };
  
    const handleHoardingClick = (id: number) => {
      navigate(`/hoarding/${id}`)
    }

    if (isError) {
      return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>
    }

    const formatDate = (date: string) => {
      const d = new Date(date);
      const day = d.getDate();
      const suffix = (day > 3 && day < 21) || day % 10 > 3 ? 'th' : ['st', 'nd', 'rd'][day % 10 - 1];
      return d.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
      }).replace(/(\d+)/, `$1${suffix}`);
  }

    return (
      <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
              {paginatedHoardings.map((hoarding: any) => (
                <div 
                  key={hoarding.request_id} 
                  onClick={() => handleHoardingClick(hoarding.request_id)}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img 
                      src="/assets/hoarding.svg"
                      alt="hoarding image"
                      className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                      <h3 className="font-medium">{hoarding.hoarding_details["Location/Route"]}</h3>
                  </div>
                  <div className="flex-grow flex items-center text-[#818181]">
                      <RiAttachment2 className="inline-block mr-1 size-5" />
                      <span>{`${hoarding.media_type_count.geo_image} geo map, ${hoarding.media_type_count.image} images, ${hoarding.media_type_count.video} video`}</span>
                  </div>
                  <div className="text-[#818181] flex-grow">
                    {formatDate(hoarding.created_at) + ", " + new Date(hoarding.created_at).toLocaleTimeString()}
                  </div>
                  <div className={`rounded-[10px] p-2 w-fit ${status === "pending" ? "bg-sidebar-30 text-black" :  status === "approved" ? "bg-[#4BB543] text-white" : "bg-[#F55555] text-white"}`}>
                    {status === "pending" ? "Approval pending" : status === "approved" ? "Approved" : "Rejected"}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col items-end mt-8">
              <Pagination className="mb-4">
                  <PaginationContent>
                      <PaginationItem>
                          <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                          <PaginationNext 
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                      </PaginationItem>
                  </PaginationContent>
              </Pagination>
              
              <h2 className="text-5xl font-extralight text-[#d9d9d9]">Let's have fun working</h2>
          </div>
      </div>
    )
}

export default HoardingStatus;