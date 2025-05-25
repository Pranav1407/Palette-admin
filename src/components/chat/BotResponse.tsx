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
    const [sorting, setSorting] = useState<SortingState>([])
    
    console.log("content", content);

    if (typeof content === 'object') {
        // Store original data for download
        const originalData = useMemo(() => content, [content]);

        // Create table data directly from the content
        const tableData = useMemo(() => {
            // Find the length of the arrays in content
            const arrayLength = Math.max(...Object.values(content).map(arr => Array.isArray(arr) ? arr.length : 0));
            
            // Create an array of objects where each object represents a row
            const data = [];
            for (let i = 0; i < arrayLength; i++) {
                const row: Record<string, any> = {};
                Object.entries(content).forEach(([key, values]) => {
                    if (Array.isArray(values) && values.length > i) {
                        row[key] = values[i];
                    } else {
                        row[key] = '-';
                    }
                });
                // Add original index to track which row this is
                row._originalIndex = i;
                data.push(row);
            }
            return data;
        }, [content]);

        // Create columns directly from the content keys
        const columnHelper = createColumnHelper<any>();
        
        const columns = useMemo(() => {
            const keys = Object.keys(content);
            
            // Start with select column
            const baseColumns = [
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
            ];
            
            keys.forEach(key => {
                baseColumns.push(
                    columnHelper.accessor((row: any) => row[key], {
                        id: key,
                        header: ({ column }) => {
                            return (
                                <p
                                    onClick={() => column.toggleSorting()}
                                    className="flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    {key.replace(/_/g, ' ').split(' ').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                    {column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                                    {column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                                </p>
                            )
                        },
                        cell: ({ getValue }) => {
                            const value = getValue();
                            return value === null || value === undefined ? '-' : value === true ? 'Yes' : value === false ? 'No' : value;
                        },
                        sortingFn: 'alphanumeric',
                        filterFn: 'includesString'
                    })
                );
            });
            
            return baseColumns;
        }, [content]);

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
                        originalData={originalData}
                    />
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
                                            }`}
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