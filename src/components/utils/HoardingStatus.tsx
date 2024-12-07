import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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

  import { useHoardings } from '@/providers/HoardingProvider'


interface HoardingStatusProps {
    searchQuery: string;
    status: 'pending' | 'approved' | 'rejected' | '';
    sort?: 'asc' | 'desc';
    fromDate?: Date;
    toDate?: Date;
}  
  const HoardingStatus = ({ searchQuery, status, sort, fromDate, toDate }: HoardingStatusProps) => {

    const { hoardings } = useHoardings()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const navigate = useNavigate()

    const filteredAndSortedHoardings = hoardings
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = status ? item.status === status : true;
      
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
      
      return matchesSearch && matchesStatus && isAfterFromDate && isBeforeToDate;
    })
    .sort((a, b) => {
      if (sort === 'asc') {
        return a.time.getTime() - b.time.getTime();
      }
      return b.time.getTime() - a.time.getTime();
    });
  
  
    // Pagination logic
    const totalPages = Math.ceil(filteredAndSortedHoardings.length / itemsPerPage)
    const paginatedHoardings = filteredAndSortedHoardings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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
  
    const handleHoardingClick = (id: string) => {
      navigate(`/hoarding/${id}`)
    }   
    
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Attachments</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedHoardings.map((hoarding) => (
                        <TableRow key={hoarding.id} onClick={() => handleHoardingClick(hoarding.id)}>
                            <TableCell>
                                <img 
                                    src={hoarding.image} 
                                    alt={hoarding.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </TableCell>
                            <TableCell>{hoarding.name}</TableCell>
                            <TableCell>{hoarding.time.toLocaleString()}</TableCell>
                            <TableCell>
                                <RiAttachment2 className="inline-block mr-1 size-5" />
                                {hoarding.attachments}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
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
        </div>
    )
}

export default HoardingStatus;