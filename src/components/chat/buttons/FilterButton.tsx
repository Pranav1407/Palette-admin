import { Button } from '../../ui/button'
import { Filter } from 'lucide-react'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Table } from "@tanstack/react-table"

// interface FilterButtonProps {
//     filterOpen: boolean;
//     setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     table: Table<any>;
// }


export const FilterButton = () => { // { filterOpen, setFilterOpen, table }: FilterButtonProps
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className='shadow-md rounded-sm' size="sm">
                        <Filter className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                {/* <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className='shadow-md rounded-sm' size="sm">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 h-80 overflow-auto">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-medium text-center">Filter Options</h4>
                            </div>
                            <div className="space-y-3 py-2">
                                {table.getAllColumns()
                                    .filter(column => column.getCanFilter())
                                    .map(column => (
                                        <div key={column.id} className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {column.columnDef.header as string}
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 border rounded-md"
                                                value={column.getFilterValue() as string ?? ''}
                                                onChange={e => column.setFilterValue(e.target.value)}
                                                placeholder={`Filter ${column.columnDef.header as string}...`}
                                            />
                                        </div>
                                    ))}
                            </div>
                            <Button 
                                className="w-full"
                                onClick={() => setFilterOpen(false)}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover> */}
                <TooltipContent>
                    <p>Filter Table</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}