import { Badge } from "@/components/ui/badge"
import { Paperclip} from "lucide-react"
import hoarding from "/assets/hoarding.png"

export interface HoardingDetailProps {
    image: string
    name: string
    status: 'pending' | 'approved' | 'rejected'
}

const HoardingDetail = ({ name, status }: HoardingDetailProps) => {
    return (
        <div className="flex items-center gap-4 p-3 border-b justify-between text-md">
            {/* <Checkbox /> */}
            <div className="flex items-center gap-6">
                <img src={hoarding} alt={name} className="w-12 h-12 object-cover rounded-lg" />
                <p>{name}</p>
            </div>
            <div className="flex items-center text-accTitle gap-2">
                <Paperclip className="h-4 w-4" />
                <span> 1 geo map,</span>
                <span> 5 images,</span>
                <span> 1 video attached</span>
            </div>
            <Badge variant={
                status === 'pending' ? 'pending' :
                status === 'approved' ? 'approved' : 'rejected'
            }>
                {status === 'pending' ? 'Approval Pending' :
                 status === 'approved' ? 'Approved' : 'Rejected'}
            </Badge>
        </div>
    )
}

export default HoardingDetail