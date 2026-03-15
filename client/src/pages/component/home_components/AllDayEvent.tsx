type Prop = {
    eventName: string
}

export default function AllDayEvent({eventName}: Prop) {
    return <>
        <div className="bg-[#4A7C59]/70 truncate min-w-0 rounded-full ml-[1vw] text-[#FFF8F0] pl-[1.5vw] mr-[1vw] pb-[1vh] pt-[1vh] mb-[1vh] hover:scale-102 duration-500 transition shadow-[0_4px_40px_0_rgba(0,0,0,0.3)]"> {eventName} </div>
    </>
}