import { LayersPlus } from "lucide-react";

function GroupButtonSkeleton() {
    return <>
        <div className="rounded-full w-2/8 h-7/8 flex justify-center items-center text-[#4A7C59] black/40 shadow-2xl">
            <LayersPlus/>
        </div>
    </>
}

export default GroupButtonSkeleton;