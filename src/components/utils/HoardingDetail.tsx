import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ImageDialog } from "@/components/utils/ImageDialog"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useHoardings } from "@/providers/HoardingProvider"

const HoardingDetail = () => {
    const { id } = useParams()
    const { hoardings: mockHoardings } = useHoardings();
    const hoarding = mockHoardings.find(h => h.id === id)
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showGeoMapModal, setShowGeoMapModal] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [isRejected, setIsRejected] = useState(false)
    const [showRejectionReason, setShowRejectionReason] = useState(false)

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === mockImages.length - 1 ? 0 : prev + 1
        )
    }

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? mockImages.length - 1 : prev - 1
        )
    }

    if (!hoarding) {
        return <div>Hoarding not found</div>
    }

    // Mock data for multiple images (you should replace this with actual data)
    const mockImages = [
        "/assets/sample.svg",
        "/assets/sample.svg",
        "/assets/sample.svg",
        "/assets/sample.svg",
        "/assets/sample.svg"
    ]

    return (
        <div className="space-y-4 p-2">
            {/* Hoarding Details Table */}
            <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                    <img 
                        src={hoarding.image} 
                        alt={hoarding.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <h2 className="text-lg font-semibold">{hoarding.name}</h2>
                </div>
                
                <div className="flex items-center gap-8">
                    <span className="text-gray-600">
                        {hoarding.time.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="flex gap-8">
                {/* Geo Map Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Geo Map</h2>
                    <img 
                        src={hoarding.geomap_image} 
                        alt="Geo Map"
                        className="w-64 h-64 object-cover rounded-lg"
                        onClick={() => setShowGeoMapModal(true)}
                    />
                </div>

                {/* Images Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Images</h2>
                    <div className="w-64 h-64 grid grid-cols-2 gap-2 max-w-[300px]" onClick={() => setShowImageModal(true)}>
                        {mockImages.slice(0, 3).map((img, index) => (
                            <div key={index} className="aspect-square">
                                <img 
                                    src={img} 
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                        {mockImages.length > 3 && (
                            <div className="aspect-square bg-black/80 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    +{mockImages.length - 3}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Section */}
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
                images={mockImages}
                currentIndex={selectedImageIndex}
                onNext={handleNextImage}
                onPrevious={handlePreviousImage}
            />

            {/* Geo Map Modal */}
            <ImageDialog 
                isOpen={showGeoMapModal}
                onClose={() => setShowGeoMapModal(false)}
                images={[hoarding.geomap_image]}
                currentIndex={0}
                onNext={() => {}}
                onPrevious={() => {}}
                singleImage
            />

            {/* Action Buttons */}
            <div className="flex h-40 flex-col items-center justify-center gap-4 mt-8">
                {!isApproved && !isRejected && !isRejecting && (
                    <div className="flex gap-4">
                        <Button 
                            variant="default" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setIsApproved(true)}
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

                {isApproved && (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-lg font-semibold">Approved</span>
                    </div>
                )}

                {isRejecting && !isRejected && (
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
                                        setIsRejected(true)
                                        setIsRejecting(false)
                                        setShowRejectionReason(true)
                                    }
                                }}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-6 h-6" />
                            <span className="text-lg font-semibold">Rejected</span>
                        </div>
                        {showRejectionReason && (
                            <div className="mt-2 p-4 bg-red-50 rounded-lg max-w-md">
                                <p className="text-red-700">{rejectionReason}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HoardingDetail