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

function Home () {
    const [ events, setEvents ] = useState<Event[]>([]);
    const [ loading, setLoad ] = useState(false);

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
    }, [])

    return (
        <>  
            <div className="flex">
                <div className="flex flex-col w-fit"> 
                    <Events/>
                    {
                        loading == true ? <Spinner/> : events.length == 0 ?
                            <div className="w-full text-violet-400 font-bold h-160 flex justify-center items-center text-2xl">
                            No events on today 
                            </div> : 
                            <div className="flex flex-col w-fit"> 
                                <div className="grid grid-cols-2 w-300 min-h-140 pl-20 mt-12 gap-10 bg-[#F1EDFF] border-4 border-violet-200  ml-19 pt-5 overflow-y-scroll no-scrollbar">
                                {events.map((e, index) => (<div className={index % 2 ? "mt-10" : ""}> <Event startTime={e.timeStart.toLowerCase()} action={e.eventName} duration={e.duration} day="Today"/> 
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
