import {useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ImageDialog } from "@/components/utils/ImageDialog"
import { CheckCircle, AlertCircle, MoveLeft } from "lucide-react"
import { fetchRequest, requestAction } from "@/data/requests"
import { HoardingData, RequestData } from "@/types/Types"
import { useAuthStore } from "@/stores/authStore"
import toast from "react-hot-toast"
import { Skeleton } from "@/components/ui/skeleton"


const HoardingDetail = () => {
    const { id } = useParams()
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showGeoMapModal, setShowGeoMapModal] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const { userId } = useAuthStore()
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isRejectLoading, setIsRejectLoading] = useState(false)
    const [geoMapLoading, setGeoMapLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false)

    // const [videoLoading, setVideoLoading] = useState(true);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const response = await fetchRequest(id ? parseInt(id) : null)
                setData(response)
                setIsLoading(false)
            } catch (err) {
                setIsError(true)
                setError(err as Error)
                setIsLoading(false)
            }
        }
        
        loadData()
    }, [id])
    

    const hoardingData = data?.payload.hoarding_data ?? {} as HoardingData;
    const requestData = data?.payload.request_data ?? {} as RequestData;
    const mediaData = data?.payload.media_data ?? [];

    let geomap: any[] = [];
    let images: (string | undefined)[] = [];

    mediaData.forEach((item: { media_type: string; presigned_url: any }) => {
        if (item.media_type === "geo_image") {
            geomap.push(item.presigned_url);
        } else if (item.media_type === "image") {
            images.push(item.presigned_url);
        }
    });

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === images.length - 1 ? 0 : prev + 1
        )
    }

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        )
    }

    if (isError) {
        return <div>{`${error}`}</div>
    }

    if (isLoading) {
        return (
            <div className="space-y-4 p-2">
                <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded" />
                        <Skeleton className="h-6 w-[200px]" />
                    </div>
                    <Skeleton className="h-4 w-[150px]" />
                </div>
                
                <div className="flex gap-8">
                    <div className="w-1/2 space-y-8 border-r border-[#d9d9d9]">
                        <div className="grid grid-cols-2 gap-4 space-y-2">
                            <div className="w-[207px] h-[200px]">
                                <Skeleton className="h-8 w-32 mb-3" />
                                <Skeleton className="w-full h-full rounded-lg" />
                            </div>
    
                            <div className="w-[227px] h-[220px]">
                                <Skeleton className="h-8 w-32 mb-3" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="w-full h-[100px] rounded-tl-lg" />
                                    <Skeleton className="w-full h-[100px] rounded-tr-lg" />
                                    <Skeleton className="w-full h-[100px] rounded-bl-lg" />
                                    <Skeleton className="w-full h-[100px] rounded-br-lg" />
                                </div>
                            </div>
    
                            <div className="w-[207px] h-[200px]">
                                <Skeleton className="h-8 w-32 mb-1" />
                                <Skeleton className="w-full h-full rounded-lg" />
                            </div>
                        </div>
                    </div>
    
                    <div className="w-1/2 p-4">
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Skeleton className="h-12 w-[70%]" />
                            <Skeleton className="h-8 w-[50%]" />
                            <Skeleton className="h-10 w-[70%]" />
                            <Skeleton className="h-10 w-[70%]" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleAction = async (action: string, comment: string) => {
        setIsRejectLoading(true);
        const actionParams = {
            action: action,
            request_id: Number(id),
            user_id: userId,
            comment: comment,
        }
        const response = await requestAction(actionParams);
        if(response.message === `Request updated successfully with ${action} action.`) {
            setIsRejectLoading(false);
            toast.success("Request updated successfully", { 
                position: 'top-right',
             })
            navigate(`/${action}`)
        }
        else {
            setIsRejectLoading(false);
            console.error("Error updating request:", response.message)
        }
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
        <div className="space-y-4 p-2">
            <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                    <img 
                        src="/assets/hoarding.svg" 
                        alt={"Hoarding image"}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <h2 className="text-lg font-semibold">{hoardingData.Hoarding_Code}, {hoardingData["Location/Route"]}</h2>
                </div>
                
                <div className="flex items-center gap-8">
                    <span className="text-gray-600">
                        {formatDate(requestData.updated_at) + ", " + new Date(requestData.updated_at).toLocaleTimeString()}
                    </span>
                </div>
            </div>
            <div className="flex gap-8">
                <div className="w-1/2 space-y-8 border-r border-[#d9d9d9]">
                    <div className="grid grid-cols-2 gap-4 space-y-2">
                        <div className="w-[207px] h-[200px]">
                            <h2 className="text-xl font-semibold mb-3">Geo Map</h2>
                            {geoMapLoading && <Skeleton className="w-full h-full rounded-lg" />}
                            <img 
                                src={geomap[0]}
                                alt="Geo Map"
                                className={`w-full h-full object-cover rounded-lg cursor-pointer ${geoMapLoading ? 'hidden' : ''}`}
                                onClick={() => setShowGeoMapModal(true)}
                                onLoad={() => setGeoMapLoading(false)}
                            />
                        </div>

                        <div className="w-[227px] h-[220px]">
                            <h2 className="text-xl font-semibold mb-3">Images</h2>
                            {imagesLoading && <Skeleton className="w-full h-full rounded-lg" />}
                            <div className={`w-full h-full grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} ${imagesLoading ? 'hidden' : ''}`} onClick={() => setShowImageModal(true)}>
                                {images.slice(0, 3).map((img, index) => (
                                    <div key={index} className={`aspect-square w-full h-full cursor-pointer ${
                                        index === 0 ? 'rounded-tl-lg' : 
                                        index === 1 ? 'rounded-tr-lg' : 
                                        index === 2 ? 'rounded-bl-lg' : ''
                                    }`}>
                                        <img 
                                            src={img} 
                                            alt={`Image`}
                                            className={`w-full h-full object-cover ${
                                                index === 0 ? 'rounded-tl-lg' : 
                                                index === 1 ? 'rounded-tr-lg' : 
                                                index === 2 ? 'rounded-bl-lg' : ''
                                            }`}
                                            onLoad={() => setImagesLoading(false)}
                                        />
                                    </div>
                                ))}
                                {images.length > 3 && (
                                    <div className="w-full h-full aspect-square bg-black/80 flex items-center justify-center rounded-br-lg">
                                        <span className="text-white text-xl font-bold">
                                            +{images.length - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className="w-[207px] h-[200px]">
                            <h2 className="text-xl font-semibold mb-1">Video</h2>
                            {videoLoading && <Skeleton className="w-full h-full rounded-lg" />}
                            <video 
                                className={`w-full h-full rounded-lg object-cover`}
                                controls
                                onLoadedData={() => setVideoLoading(false)}
                            >
                                <source src="" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div> */}
                    </div>
                </div>

                <div className="w-1/2 p-4 rounded-lg">
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        {requestData.current_status === "pending" && !isRejecting && (
                            <div className="w-[70%] flex flex-col gap-4">
                                <p className="text-4xl text-center">Approve or Reject</p>
                                <p className="text-[#818181] font-light text-2xl text-center">View the images and videos before making a decision.</p>
                                <div className="flex flex-col gap-4">
                                    <Button 
                                        variant="default" 
                                        className="bg-[#4BB543] rounded-[10px] w-full"
                                        onClick={() => setShowApproveModal(true)}
                                    >
                                        Approve
                                    </Button>
                                    <Button 
                                        variant="default"
                                        className="border border-[#F55555] rounded-[10px] w-full bg-transparent text-[#F55555]"
                                        onClick={() => setIsRejecting(true)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isRejecting && (
                            <div className="w-full flex flex-col items-center gap-4">
                                <AlertCircle className="w-40 h-40 text-[#F55555]" />
                                <span className="text-4xl">Rejected.</span>
                                <form 
                                    className="flex flex-col gap-4 w-full items-center"
                                    onSubmit={(e) => { e.preventDefault(); handleAction("rejected", rejectionReason); }}
                                >
                                    <textarea 
                                        className="w-[90%] p-2 border border-[#d1d1d1] rounded-[10px] text-[#818181] text-lg resize-none outline-none"
                                        placeholder="Provide the appropriate reason for it."
                                        value={rejectionReason}
                                        required
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <Button 
                                        variant="default"
                                        type="submit" 
                                        className="bg-[#4BB543] rounded-[10px] w-[50%]"
                                        disabled={isRejectLoading}
                                        onClick={() => {
                                            if (rejectionReason.length > 0) {
                                                handleAction("rejected", rejectionReason)
                                            } else {
                                                toast.error("Please provide a reason for rejection.", {
                                                    position: "bottom-right",
                                                });
                                            }
                                        }}
                                    >
                                        {isRejectLoading ? "Rejecting..." : "Reject"}
                                    </Button>
                                </form>
                                <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => setIsRejecting(false)}>
                                    <MoveLeft className="w-6 h-6" />
                                    <span>Go Back</span>
                                </div>
                            </div>
                        )}

                        {requestData.current_status === "approved" && (
                            <div className="flex flex-col items-center gap-4">
                                <CheckCircle className="w-40 h-40 text-[#4BB543]" />
                                <span className="text-4xl">{`Approved on ${formatDate(requestData.updated_at)}`}</span>
                                <div className="flex flex-col text-[#818181] text-center text-2xl">
                                    <p>{`Job approved at ${new Date(requestData.updated_at).toLocaleTimeString()},`}</p>
                                    <p>{formatDate(requestData.updated_at)}</p>
                                </div>
                            </div>
                        )}

                        {requestData.current_status === "rejected" && (
                            <div className="flex flex-col items-center gap-4">
                                <AlertCircle className="w-40 h-40 text-[#F55555]" />
                                <span className="text-4xl">Rejected.</span>
                                <span className="text-[#818181] text-2xl">Waiting on resubmission.</span>
                            </div>
                        )}
                    </div>
                </div>
                {showApproveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                            <h3 className="text-xl font-semibold mb-4 text-center">Confirm Approval</h3>
                            <p className="text-gray-600 mb-6 text-center">Are you sure you want to approve?</p>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowApproveModal(false)}
                                    className="border-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-[#4BB543]"
                                    onClick={() => {
                                        handleAction("approved", "");
                                        setShowApproveModal(false);
                                    }}
                                >
                                    Approve
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ImageDialog 
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                images={images}
                currentIndex={selectedImageIndex}
                onNext={handleNextImage}
                onPrevious={handlePreviousImage}
            />

            <ImageDialog 
                isOpen={showGeoMapModal}
                onClose={() => setShowGeoMapModal(false)}
                images={geomap}
                currentIndex={0}
                onNext={() => {}}
                onPrevious={() => {}}
                singleImage
            />

        </div>
    )
}

export default HoardingDetail