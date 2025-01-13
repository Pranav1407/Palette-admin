import {useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ImageDialog } from "@/components/utils/ImageDialog"
import { CheckCircle, AlertCircle, MoveLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchRequest, requestAction } from "@/data/requests"
import { HoardingData, RequestData } from "@/types/Types"
import { useAuthStore } from "@/stores/authStore"
import toast from "react-hot-toast"


const HoardingDetail = () => {
    const { id } = useParams()
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showGeoMapModal, setShowGeoMapModal] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const { userId } = useAuthStore()
    const navigate = useNavigate();

    const {data, isLoading, isError, error } = useQuery({
        queryKey:["request"],
        queryFn: () => fetchRequest(id ? parseInt(id) : null)
    })

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
            images.push(item.presigned_url);
            images.push(item.presigned_url);
            images.push(item.presigned_url);
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
        return <div>Loading...</div>
    }

    const handleAction = async (action: string, comment: string) => {
        const actionParams = {
            action: action,
            request_id: Number(id),
            user_id: userId,
            comment: comment,
        }
        const response = await requestAction(actionParams);
        if(response.message === `Request updated successfully with ${action} action.`) {
            toast("Request updated successfully", { icon: "🚀" })
            navigate(`/${action}`)
        }
        else {
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
                    <h2 className="text-lg font-semibold">{hoardingData["Location/Route"]}</h2>
                </div>
                
                <div className="flex items-center gap-8">
                    <span className="text-gray-600">
                        {formatDate(requestData.updated_at) + ", " + new Date(requestData.updated_at).toLocaleTimeString()}
                    </span>
                </div>
            </div>
            <div className="flex gap-8">
                <div className="w-1/2 space-y-8 border-r border-[#d9d9d9]">
                    <div className="grid grid-cols-2">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Geo Map</h2>
                            <img 
                                src={geomap[0]}
                                alt="Geo Map"
                                className="w-64 h-32 object-cover rounded-lg"
                                onClick={() => setShowGeoMapModal(true)}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">Images</h2>
                            <div className="max-h-32 w-32 h-32 grid grid-cols-2 gap-4" onClick={() => setShowImageModal(true)}>
                                {images.slice(0, 3).map((img, index) => (
                                    <div key={index} className="aspect-square w-16 h-16">
                                        <img 
                                            src={img} 
                                            alt={`Image`}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                                {images.length > 3 && (
                                    <div className="w-16 h-16 aspect-square bg-black/80 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            +{images.length - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">Video</h2>
                        <video 
                            className="w-52 h-52 rounded-lg object-cover"
                            controls
                        >
                            <source src="" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
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
                                        onClick={() => handleAction("approved", "")}
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
                                        Submit
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