import { GoSync } from "react-icons/go";
interface  TooltipProps {
    message: string;
    bg: string;
  }

const CustomTooltip = ({ message, bg }: TooltipProps) => {
  return (
    <div className={`absolute top-12 left-1/2 transform w-fit shadow-lg rounded-[20px] p-4 -translate-x-1/2 -translate-y-1/2 text-black text-center ${bg} flex items-center gap-2`}>
        <GoSync className="animate-spin" />
        {message}
    </div>
  )
}

export default CustomTooltip