type Prop = {
    time: string,
}


function Event ({time}: Prop) {
    return <div className="flex items-center border-4 rounded-2xl w-180 h-15 border-violet-200 shadow-2xs bg-white pl-2">
    </div>
}

export default Event;