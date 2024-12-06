import { useParams } from "react-router-dom"
import { mockHoardings } from "@/data/mockHoardings"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ImageDialog } from "@/components/utils/ImageDialog"

const HoardingDetail = () => {
    const { id } = useParams()
    const hoarding = mockHoardings.find(h => h.id === id)
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showGeoMapModal, setShowGeoMapModal] = useState(false)

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
                        <source src="/path-to-your-video.mp4" type="video/mp4" />
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
            <div className="flex gap-4">
                <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => console.log('Approved')}
                >
                    Approve
                </Button>
                <Button 
                    variant="default"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => console.log('Rejected')}
                >
                    Reject
                </Button>
            </div>
        </div>
    )
}

export default HoardingDetail