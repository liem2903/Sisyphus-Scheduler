import Event from "./component/Event";

function Home () {
    return (
        <div className="flex justify-center flex-col items-center gap-1">   
            <div className="text-violet-800 font-bold text-2xl"> Today </div>
            <Event time={""}/> 
            <Event time={""}/>  
            <Event time={""}/> 
        </div>
    )
}

export default Home;