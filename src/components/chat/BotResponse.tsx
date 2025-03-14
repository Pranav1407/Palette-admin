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
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'
import { DownloadButton } from './buttons/DownloadButton';
// import { FilterButton } from './buttons/FilterButton';
import { DownloadOption } from '@/types/Types';

interface TableContent {
    [key: string]: (string | number | boolean)[];
}

const BotResponse = ({ content }: { content: string | TableContent }) => {

    const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([
        { 
            id: 'ppt', 
            label: 'Download PPT', 
            selected: true,
            icon: 'PPT.svg'
        },
        { 
            id: 'xlsx', 
            label: 'Download XLSX', 
            selected: true,
            icon: 'XLS.svg'
        },
        { 
            id: 'docx', 
            label: 'Download DOCX', 
            selected: false,
            icon: 'DOC.svg'
        },
        { 
            id: 'pdf', 
            label: 'Download PDF', 
            selected: false,
            icon: 'PDF.svg'
        },
    ])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    // const [filterOpen, setFilterOpen] = useState(false)
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'hoarding_id',
            desc: false
        }
    ])
    

    if (typeof content === 'object') {

        const tableData = useMemo(() => {
            // Find first non-empty array to use as mapping reference
            const mappingKey = Object.entries(content).find(([_, value]) => 
                Array.isArray(value) && value.length > 0
            )?.[0] || Object.keys(content)[0];
        
            return content[mappingKey].map((_, index) => ({
                district: content.district?.[index] || '-',
                location_route: content.location?.[index] || '-',
                direction_route: content.direction_route?.[index] || '-',
                width: content.width?.[index] || '-',
                height: content.height?.[index] || '-',
                area: content.area?.[index] || '-',
                type: content.type?.[index] || '-',
                rate_1_month: content.rate_sqft_1_months?.[index] || '-',
                rate_3_months: content.rate_sqft_3_months?.[index] || '-',
                rate_6_months: content.rate_sqft_6_months?.[index] || '-',
                rate_12_months: content.rate_sqft_12_months?.[index] || '-',
                floor: content.floor?.[index] || '-',
                hoarding_id: content.hoarding_id?.[index] || '-',
                hoarding_code: content.hoarding_code?.[index] || '-',
                status: content.status?.[index] || '-',
                location: content.location_coordinates?.[index] || '-',
                available: content.available?.[index] ? 'Yes' : '-',
                lat: content.lat?.[index] || '-',
                long: content.long?.[index] || '-'
            }))
        },[content]);
               

        const columnHelper = createColumnHelper<any>();

        const columns = useMemo(() => [
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <div className="w-[50px]">
                        <input
                            type="checkbox"
                            checked={table.getIsAllRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            className="w-4 h-4"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="w-[50px] relative cursor-pointer" onClick={row.getToggleSelectedHandler()}>
                        <img src='/assets/hoarding.svg' alt='hoarding' />
                        {row.getIsSelected() && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                                <svg 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        )}
                    </div>
                )
            }),
            columnHelper.accessor('hoarding_id', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Hoarding ID
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('district', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            District
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('location_route', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Location
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('direction_route', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Direction
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('width', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Width
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('height', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Height
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('area', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Area
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('type', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Type
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_1_month', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            1 Month Rate
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_3_months', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            3 Months Rate
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_6_months', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            6 Months Rate
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('rate_12_months', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            12 Months Rate
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('floor', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Floor
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('hoarding_code', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Hoarding Code
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('status', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Status
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('available', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Available
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('location', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Location Coordinates
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('lat', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Latitude
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
                filterFn: 'includesString'
            }),
            columnHelper.accessor('long', {
                header: ({ column }) => {
                    return (
                        <p
                            onClick={() => column.toggleSorting()}
                            className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                            Longitude
                            {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                            {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                        </p>
                    )
                },
                sortingFn: 'alphanumeric',
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
            <div className="space-y-4 w-full max-w-full bg-gray-100]">
                <div className="flex items-center gap-2">
                    <DownloadButton 
                        downloadOptions={downloadOptions}
                        setDownloadOptions={setDownloadOptions}
                        table={table}
                    />
                    {/* <FilterButton 
                        filterOpen={filterOpen}
                        setFilterOpen={setFilterOpen}
                        table={table}
                    /> */}
                </div>
                
                <div className="w-full max-h-96 overflow-x-auto overflow-y-auto border rounded-lg relative
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar]:h-2
                    [&::-webkit-scrollbar-track]:rounded-lg
                    [&::-webkit-scrollbar-track]:bg-tansparent
                    [&::-webkit-scrollbar-thumb]:rounded-lg
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
                >
                    <table className="max-w-full table-fixed relative">
                        <thead className="rounded-lg sticky top-0 z-20">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className='bg-sidebar-15'>
                                    {headerGroup.headers.map((header,index) => (
                                        <th 
                                            key={header.id} 
                                            className={`p-4 text-center font-normal text-black whitespace-nowrap ${
                                                index === 0 ? 'rounded-l-lg w-[10px] min-w-[10px] sticky left-0 z-10 bg-sidebar-15' : 
                                                index === 1 ? 'min-w-[150px] sticky left-[82px] z-10 bg-sidebar-15' :
                                                'min-w-[150px]'
                                            } ${
                                                index === headerGroup.headers.length - 1 ? 'rounded-r-lg' : ''
                                            }`}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 my-2">
                                    {row.getVisibleCells().map((cell, index) => (
                                        <td 
                                            key={cell.id} 
                                            className={`border-b bg-white p-4 text-center text-[#818181] whitespace-nowrap ${
                                                index === 0 ? 'rounded-l-lg w-[10px] min-w-[10px] sticky left-0 z-10 bg-white' : 
                                                index === 1 ? 'min-w-[150px] sticky left-[82px] z-10 bg-white' :
                                                'min-w-[150px]'
                                            } ${
                                                index === row.getVisibleCells().length - 1 ? 'rounded-r-lg' : ''
                                            } ${cell.column.columnDef.id === 'district' ? 'text-black' : ''}
                                            `}
                                        >
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