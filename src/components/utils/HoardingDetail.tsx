import {useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Key, useState } from "react"
import { ImageDialog } from "@/components/utils/ImageDialog"
import { CheckCircle, AlertCircle } from "lucide-react"
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
    const [showRejectionReason, setShowRejectionReason] = useState(false)
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
                        {new Date(requestData.updated_at).toLocaleString()}
                    </span>
                </div>
                
            </div>
            <div className="flex gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Geo Map</h2>
                    <img 
                        src={geomap[0]}
                        alt="Geo Map"
                        className="w-64 h-64 object-cover rounded-lg"
                        onClick={() => setShowGeoMapModal(true)}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Images</h2>
                    <div className="w-64 h-64 grid grid-cols-2 gap-2 max-w-[300px]" onClick={() => setShowImageModal(true)}>
                        {images.slice(0, 3).map((img: string | undefined, index: Key | null | undefined) => (
                            <div key={index} className="aspect-square">
                                <img 
                                    src={img} 
                                    alt={`Image`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                        {images.length > 3 && (
                            <div className="aspect-square bg-black/80 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    +{images.length - 3}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Video</h2>
                    <video 
                        className="w-full h-64 rounded-lg object-cover"
                        controls
                    >
                        <source src="" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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

            <div className="flex h-40 flex-col items-center justify-center gap-4 mt-8">
                {requestData.current_status === "pending" && (
                    <div className="flex gap-4">
                        <Button 
                            variant="default" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                handleAction("approved","")
                            }}
                        >
                            Approve
                        </Button>
                        <Button 
                            variant="default"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => setIsRejecting(true)}
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {requestData.current_status === "approved" && (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-lg font-semibold">{`Approved by ${requestData.action_by}`}</span>
                    </div>
                )}

                {isRejecting && (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <textarea
                            className="w-full p-3 border border-secondary rounded-lg min-h-[100px] resize-none outline-none"
                            placeholder="Please provide reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setIsRejecting(false)
                                    setRejectionReason("")
                                }}
                            >
                                Back
                            </Button>
                            <Button 
                                variant="default"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    if (rejectionReason.trim()) {
                                        setIsRejecting(false)
                                        setShowRejectionReason(true)
                                        handleAction("rejected", rejectionReason)
                                    }
                                }}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </div>
                )}

                {requestData.current_status === "rejected" && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-6 h-6" />
                            <span className="text-lg font-semibold">{`Rejected by ${requestData.action_by}`}</span>
                        </div>
                        {showRejectionReason && (
                            <div className="mt-2 p-4 bg-red-50 rounded-lg max-w-md">
                                <p className="text-red-700">{`${requestData.comment}`}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HoardingDetail