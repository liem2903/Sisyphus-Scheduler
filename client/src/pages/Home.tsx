import Event from "./component/Event";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { api } from "../interceptor/interceptor";
import Spinner from "./component/Spinner";
import Events from "./Events";
import FriendChecker from "./component/FriendChecker";

type Event = {
    eventName: string,
    timeStart: string,
    duration: string
}
// Fix the view point issues. Consistent across - learn about this. 
function Home () {
    const [ events, setEvents ] = useState<Event[]>([]);
    const [ loading, setLoad ] = useState(false);
    const [ reload, setReload ] = useState(false);

    useEffect(() => {
        const getAccess = async () => {
            setLoad(true);
            let res = await api.get('/auth/getCalender');
            let calenderData = res.data.data;
            let resEvents: Event[] = []
            
            calenderData.map((data: any) => {
                let startDate = DateTime.fromISO(data.start.dateTime);
                let endDate = DateTime.fromISO(data.end.dateTime);

                let event = {
                    eventName: data.summary,
                    timeStart: startDate.toFormat("h:mma"),
                    duration: `${endDate.diff(startDate, 'hours').hours}`
                }

                resEvents.push(event);
            })

            setEvents(resEvents);
            setLoad(false);
        }

        getAccess();
    }, [reload])

    return (
        <>  
            <div className="flex bg-[#18142c]">
                <div className="flex flex-col w-fit"> 
                    <Events reload={reload} setReload={setReload}/>
                    {
                        loading == true ? <Spinner/> : events.length == 0 ?
                            <div className="w-[78vw] text-violet-500 font-bold h-[65vh] flex justify-center items-center text-2xl">
                            No events on today 
                            </div> : 
                            <div className="flex flex-col"> 
                                <div className="content-start grid grid-cols-1 w-[77vw] h-[65vh] pl-20 mt-12 gap-y-[3vh] bg-violet-300 border-4 border-violet-600 ml-19 pt-5 overflow-y-scroll no-scrollbar">
                                {events.map((e) => (<div> <Event startTime={e.timeStart.toLowerCase()} action={e.eventName} duration={e.duration} day="Today"/> 
                                </div>))} 
                                </div>
                            </div>
                    }
                </div>
                <FriendChecker/> 
            </div>
            
        </>
     )
}

export default Home;
