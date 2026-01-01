type Prop = {
    startTime: string,
    action: string,
    day: string,
    duration: string
}

function Event ({startTime, action, day, duration}: Prop) {
    return ( 
        <div className="flex items-center border-8 rounded-2xl w-180 h-30 border-white bg-white pl-2 hover:cursor-grab">
            <div className="flex justify-center items-center w-28 h-25 border-4 border-violet-200 bg-violet-200 rounded-lg font-bold text-2xl shadow">
                <div className="flex flex-col items-center">
                    <div className="font-light text-lg"> {day} </div>
                    <div> {startTime} </div> 
                </div>
                 
            </div>
            <div className="h-15 ml-5 flex flex-col justify-between">
                <div className="font-bold text-2xl shadow-2xl"> {action} </div> 
                <div className="font-extralight text-lg"> {parseInt(duration) == 1 ? `For ${duration} hour ` : `For ${duration} hours`} </div>
            </div>
        </div>
    )
}

export default Event;