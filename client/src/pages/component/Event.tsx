type Prop = {
    startTime: string,
    action: string,
    duration: string
}

function Event ({startTime, action, duration}: Prop) {
    return ( 
        <div className="flex items-center border-8 rounded-4xl w-5/6 h-30 border-white bg-white pl-2 hover:cursor-grab">
            <div className="flex justify-center items-center w-28 h-20 border-4 border-violet-200 bg-violet-200 rounded-lg font-bold text-2xl shadow">
                <div className="flex flex-col items-center">
                    <div> {startTime} </div> 
                </div>
                 
            </div>
            <div className="h-15 ml-5 flex flex-col justify-between">
                <div className="font-bold text-2xl"> {action} </div> 
                <div className="font-extralight text-lg"> {parseInt(duration) == 1 ? `For ${duration} hour ` : `For ${duration} hours`} </div>
            </div>
        </div>
    )
}

export default Event;