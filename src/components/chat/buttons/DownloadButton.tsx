import { Button } from '../../ui/button'
import { Download } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { downloadFile } from '@/data/requests';
import toast from 'react-hot-toast';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';

interface DownloadOption {
    id: string;
    label: string;
    selected: boolean;
    icon: React.ReactNode;
}

interface DownloadButtonProps {
    downloadOptions: DownloadOption[];
    setDownloadOptions: React.Dispatch<React.SetStateAction<DownloadOption[]>>;
    table: any;
}


export const DownloadButton = ({ downloadOptions, setDownloadOptions, table }: DownloadButtonProps) => {

    const [downloading, setDownloading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDownload = async () => {
        
        const selectedFormats = downloadOptions
        .filter(opt => opt.selected)
        .map(opt => opt.id.toUpperCase());
        //@ts-expect-error - selectedRows is not defined
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    
        const downloadData = {
            formats: selectedFormats,
            response: selectedRows
        };

        if(selectedFormats.length === 0) {
            toast.error('Please select at least one format to download.', {
                position: 'top-right',
                duration: 5000
            });
            return;
        }
    
        if(selectedRows.length > 0) {
            setDownloading(true);
            try {
                const blob = await downloadFile(downloadData);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'billboard_files.zip');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setDownloading(false);
                setOpen(false);
            } catch (error) {
                setDownloading(false);
                console.error('Download failed:', error);
            }
        } else {
            setDownloading(false);
            toast.error('Please select at least one row to download.', {
                position: 'top-right',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <DialogTrigger asChild>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className='shadow-md rounded-sm' size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                        <p>Download Files</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle></DialogTitle>
                <div className="space-y-4">
                    <div className="border-b pb-2">
                        <h4 className="font-normal text-center text-[#818181]">{downloading ? 'Preparing files...' : 'Select download format(s)'}</h4>
                    </div>
                    <div className="flex items-center justify-around gap-4 py-2">
                        {downloadOptions.map((option) => (
                            <div 
                                key={option.id} 
                                className={`p-3 ${
                                    option.id === 'ppt' && option.selected ? 'border-b-4 border-[#E23410] bg-red-300 rounded-md cursor-pointer' : 
                                    option.id === 'pdf' ? 'opacity-50 cursor-not-allowed' :
                                    option.id === 'xlsx' && option.selected ? 'border-b-4 border-[#168A1A] bg-[#168A1A26] rounded-md cursor-pointer' :
                                    option.id === 'docx' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <img 
                                    src={`/assets/icons/${option.icon}`} 
                                    alt={option.label} 
                                    onClick={() => {
                                        if (option.id !== 'pdf' && option.id !== 'docx') {
                                            setDownloadOptions(prev =>
                                                prev.map(opt =>
                                                    opt.id === option.id ? { ...opt, selected: !opt.selected } : opt
                                                )
                                            )
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div 
                        className={`w-[70%] mx-auto p-2 rounded-[10px] text-center cursor-pointer ${downloading ? 'bg-transparent border border-[#168A1A] text-[#168A1A]' : 'bg-[#168A1A] text-white'}`}
                        onClick={() => {
                            handleDownload();
                        }}
                    >
                        {downloading ? 'Downloading...' : 'Download'}
                    </div>
                </div>
            </DialogContent>
            {downloading && 
                <div className="absolute top-12 left-1/2 transform w-fit shadow-lg rounded-[20px] p-4 -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] text-black text-center">
                    Preparing and downloading files. Please wait before making a new request.
                </div>
            }
        </Dialog>
    )
}
