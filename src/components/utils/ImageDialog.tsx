import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

interface ImageDialogProps {
    isOpen: boolean
    onClose: () => void
    images: string[]
    currentIndex: number
    onNext: () => void
    onPrevious: () => void
    singleImage?: boolean
}

export function ImageDialog({
    isOpen,
    onClose,
    images,
    currentIndex,
    onNext,
    onPrevious,
    singleImage = false
}: ImageDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-transparent border-none">
                <div className="relative flex flex-col gap-4">
                    <img
                        src={singleImage ? images[0] : images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="w-full h-[70vh] object-contain"
                    />
                    {!singleImage && (
                        <>
                            <MdOutlineKeyboardArrowLeft 
                                size={64} 
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:cursor-pointer"
                                onClick={onPrevious}
                            />
                            <MdOutlineKeyboardArrowRight 
                                size={64} 
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:cursor-pointer"
                                onClick={onNext} 
                            />
            
                            {/* Thumbnails Footer */}
                            <div className="flex gap-2 justify-center p-2 rounded-lg">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "cursor-pointer transition-all duration-200",
                                            "min-w-[80px] h-[60px]",
                                            index === currentIndex 
                                                ? "ring-2 ring-white ring-offset-2 ring-offset-black" 
                                                : "opacity-70 hover:opacity-100"
                                        )}
                                        onClick={() => {
                                            if (index > currentIndex) {
                                                for (let i = currentIndex; i < index; i++) onNext()
                                            } else if (index < currentIndex) {
                                                for (let i = currentIndex; i > index; i--) onPrevious()
                                            }
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
