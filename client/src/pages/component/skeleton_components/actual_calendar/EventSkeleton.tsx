function EventSkeleton () {
    return ( 
        <div className="flex flex-1 items-center rounded-full pt-[1vh] pb-[1vh] pr-[1vw] bg-[#F5ECD7]/80 mr-[1vw] pl-[1vw] shadow-xl border border-[#4A7C59]">
            <div className="ml-5 flex text-[#3B1F0E]">
                <div className="flex justify-center items-center pl-[1vw] pr-[1vw] bg-[#4A7C59] rounded-full font-bold">
                    <div className="flex flex-col items-center text-[clamp(1rem,1.25vw,2rem)]">
                        <div className="text-[#F5ECD7]"> Filler Time </div> 
                    </div>        
                </div>   

                <div className="ml-5 flex flex-col justify-between truncate">
                    <div className="font-bold text-[clamp(1rem,1.25vw,2rem)] text-[#3B1F0E] min-w-0"> Filler Event </div> 
                    <div className="font-extralight text-[clamp(1rem,1vw,2rem)] text-[#3B1F0E] min-w-0"> Filler Description </div>
                </div>
            </div>
        </div>
    )
}

export default EventSkeleton;