import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SetStateAction, useState } from "react"
import { mockHoardings } from "@/data/mockHoardings"
import { RiAttachment2 } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// interface Hoarding {
//     id: string
//     image: string
//     name: string
//     time: Date
//     attachments: number
//     status: 'pending' | 'approved' | 'rejected'
// }

const HoardingStatus = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const navigate = useNavigate()

    // Sample data - replace with your actual data
    let hoardings = mockHoardings

    // Filtering logic
    const filteredHoardings = hoardings.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sorting logic
    const sortByTime = (order: 'asc' | 'desc') => {
        const sorted = [...filteredHoardings].sort((a, b) => {
            return order === 'asc' 
                ? a.time.getTime() - b.time.getTime()
                : b.time.getTime() - a.time.getTime()
        })
        return sorted
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredHoardings.length / itemsPerPage)
    const paginatedHoardings = filteredHoardings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleHoardingClick = (id: string) => {
        navigate(`/hoarding/${id}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search hoarding..."
                    value={searchQuery}
                    onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default">Sort by Time</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => sortByTime('asc')}>
                            Oldest first
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sortByTime('desc')}>
                            Newest first
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

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

            <div className="flex justify-center gap-2">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default HoardingStatus