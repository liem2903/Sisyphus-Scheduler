function EventSkeleton () {
    return ( 
        <div className="flex flex-1 items-center rounded-full pt-[1vh] pb-[1vh] pr-[1vw] bg-[#F5ECD7]/80 mr-[1vw] pl-[0.5vw] border border-[#4A7C59] shadow-[0_4px_px_0_rgba(0,0,0,0.2)]">
            <div className="ml-5 flex text-[#3B1F0E] rounded-full shadow-[0_4px_25px_0_rgba(0,0,0,0.3)] w-17/18 bg-[#4A7C59]/50">
                <div className="flex justify-center items-center bg-[#4A7C59] rounded-full pl-[1vw] pr-[1vw] font-semibold shadow-[inset_0_4px_15px_0_rgba(0,0,0,0.25)] animate-pulse">
                    <div className="flex flex-col items-center text-[clamp(1rem,1.25vw,2rem)] min-w-0">
                        <div className="text-[#F5ECD7]"> 00:00AM </div> 
                    </div>        
                </div>   

                <div className="ml-5 flex flex-col justify-between truncate">
                    <div className="font-bold text-[clamp(1rem,1.25vw,2rem)] text-[#3B1F0E] pr-[1vw] animate-pulse"> Filler Event </div> 
                    <div className="font-extralight text-[clamp(1rem,1vw,2rem)] text-[#3B1F0E] min-w-0 animate-pulse"> For X hours </div>
                </div>
            </div>
        </div>
    )
}

export default EventSkeleton;