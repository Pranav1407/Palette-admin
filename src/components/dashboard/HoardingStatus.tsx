import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import HoardingDetail from "./HoardingDetail"

const HoardingStatus = () => {
    const today = new Date()
    const day = today.getDate()
    const ordinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th'
        switch (day % 10) {
            case 1: return "st"
            case 2: return "nd"
            case 3: return "rd"
            default: return "th"
        }
    }
    
    const dateWithOrdinal = `Today, ${day}${ordinalSuffix(day)} ${today.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })}`

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="today">
                <AccordionTrigger>{dateWithOrdinal}</AccordionTrigger>
                <AccordionContent>
                    <HoardingDetail
                        image="/hoarding1.jpg"
                        name="Highway Billboard A1"
                        status="pending"
                    />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="approved">
                <AccordionTrigger>Today Approved</AccordionTrigger>
                <AccordionContent>
                    <HoardingDetail 
                        image="/hoarding2.jpg"
                        name="City Center Display B2"
                        status="approved"
                    />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rejected">
                <AccordionTrigger>Today Rejected</AccordionTrigger>
                <AccordionContent>
                    <HoardingDetail 
                        image="/hoarding3.jpg"
                        name="Mall Entrance Board C3"
                        status="rejected"
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default HoardingStatus