import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Download, Filter, FileSpreadsheet, FileText, FileImage } from 'lucide-react'
import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface BotResponseProps {
    content: {
        district: string[];
        location_route: string[];
        direction_route: string[];
        width: number[];
        height: number[];
        area: number[];
        type: string[];
        rate_sqft_1_months: number[];
        rate_sqft_3_months: number[];
        rate_sqft_6_months: number[];
        rate_sqft_12_months: number[];
        floor: string[];
        hoarding_id: number[];
        hoarding_code: string[];
        status: string[];
        location: string[];
        available: boolean[];
        lat: number[];
        long: number[];
    } | string;
}

interface DownloadOption {
    id: string;
    label: string;
    checked: boolean;
    icon: React.ReactNode;
}


const BotResponse = ({ content }: BotResponseProps) => {

    const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([
        { 
            id: 'ppt', 
            label: 'Download PPT', 
            checked: true,
            icon: <FileImage className="h-4 w-4 text-gray-500" />
        },
        { 
            id: 'xls', 
            label: 'Download XLS', 
            checked: true,
            icon: <FileSpreadsheet className="h-4 w-4 text-gray-500" />
        },
        { 
            id: 'docx', 
            label: 'Download DOCX', 
            checked: false,
            icon: <FileText className="h-4 w-4 text-gray-500" />
        },
        { 
            id: 'pdf', 
            label: 'Download PDF', 
            checked: false,
            icon: <FileText className="h-4 w-4 text-gray-500" />
        },
    ])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const [sorting, setSorting] = useState<SortingState>([])


    if (typeof content === 'object') {

        const tableData = useMemo(() => 
            content.district.map((_, index) => ({
                district: content.district[index],
                location: content.location_route[index],
                direction: content.direction_route[index],
                dimensions: `${content.width[index]} x ${content.height[index]}`,
                area: content.area[index],
                type: content.type[index],
                rate_1_month: content.rate_sqft_1_months[index],
                rate_3_months: content.rate_sqft_3_months[index],
                rate_6_months: content.rate_sqft_6_months[index],
                rate_12_months: content.rate_sqft_12_months[index],
                floor: content.floor[index],
                hoarding_code: content.hoarding_code[index],
                available: content.available[index] ? 'Yes' : 'No'
            })), 
            [content]
        );

        const columnHelper = createColumnHelper<any>();

        const columns = useMemo(() => [
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="w-4 h-4"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="w-4 h-4"
                    />
                ),
            }),
            columnHelper.accessor('district', {
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting()}
                            className="flex items-center gap-1"
                        >
                            District
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </Button>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('location', {
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting()}
                            className="flex items-center gap-1"
                        >
                            Location
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </Button>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('direction', {
                header: 'Direction',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('dimensions', {
                header: 'Dimensions',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('area', {
                header: 'Area',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('type', {
                header: 'Type',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_1_month', {
                header: '1 Month Rate',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_3_months', {
                header: '3 Months Rate',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_6_months', {
                header: '6 Months Rate',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_12_months', {
                header: '12 Months Rate',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('floor', {
                header: 'Floor',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('hoarding_code', {
                header: 'Hoarding Code',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('available', {
                header: 'Available',
                filterFn: 'includesString'
            })
        ], []);

        const table = useReactTable({
            data: tableData,
            columns,
            state: {
                sorting,
                columnFilters,
            },
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getSortedRowModel: getSortedRowModel(),
            enableRowSelection: true,
        })

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <h4 className="font-medium text-center">Download Options</h4>
                                </div>
                                <div className="space-y-3 py-2">
                                    {downloadOptions.map((option) => (
                                        <div key={option.id} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={option.id}
                                                    checked={option.checked}
                                                    onCheckedChange={(checked) => {
                                                        setDownloadOptions(prev => 
                                                            prev.map(opt => 
                                                                opt.id === option.id 
                                                                    ? { ...opt, checked: !!checked }
                                                                    : opt
                                                            )
                                                        )
                                                    }}
                                                />
                                                <label 
                                                    htmlFor={option.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {option.label}
                                                </label>
                                            </div>
                                            {option.icon}
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    className="w-full"
                                    onClick={() => {
                                        const selectedFormats = downloadOptions
                                            .filter(opt => opt.checked)
                                            .map(opt => opt.id)
                                        console.log(selectedFormats)
                                    }}
                                >
                                    Download Selected
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
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
                    </Popover>
                </div>
                
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="border p-2 bg-gray-50">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="border p-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return <p className="p-3 rounded-lg border">{content}</p>
}

export default BotResponse