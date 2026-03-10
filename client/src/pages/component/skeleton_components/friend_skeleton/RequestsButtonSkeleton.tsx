import { Inbox } from "lucide-react";

function RequestsButtonSkeleton () { 
    return <>
        <div className="w-[clamp(1rem,1.5vw,5rem)] flex justify-center items-center text-[#4A7C59]">
            <div className="rounded-full w-1/1 aspect-square flex justify-center items-center relative leading-none">
                <Inbox size={"clamp(1rem,1.5vw,100rem)"}/> 
            </div>
        </div>      
    </>
}

export default RequestsButtonSkeleton;
