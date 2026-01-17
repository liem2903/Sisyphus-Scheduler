import { api } from "../../../interceptor/interceptor";
import AddFriendButton from "./AddFriendButton";
import FriendBlock from "./FriendBlock";
import RequestsButton from "./RequestsButton";
import { useEffect, useState } from 'react';
import type { friendRequest } from "../../../types/types";

function FriendChecker() {
    const [ friendRequests, setFriendRequests ] = useState<friendRequest[]>([]);

    useEffect(() => {
        const getNotifications = async () => {             
            const requests = await api.get('/friend/get-friend-requests', {withCredentials: true});
            let data: friendRequest[] = requests.data.data;
            let friendRequests: friendRequest[] = []

            console.log(data);
            
            data.map(req => friendRequests.push(req));
            setFriendRequests(friendRequests);
        }
        
        getNotifications();
    }, [])

    return <>
        <div className="flex-1 flex justify-center">
            <div className="border-2 border-violet-600 w-4/5 mt-10 bg-violet-300 overflow-y-scroll no-scrollbar shadow h-[80vh] flex flex-col gap-5 pt-3"> 
                <div className="flex">
                    <div className="flex justify-end font-bold underline w-3/5"> 
                        Friends 
                    </div>
                    <div className="flex-1 flex justify-center gap-x-2"> 
                        <RequestsButton friendRequests={friendRequests} setRequests={setFriendRequests}/>
                        <AddFriendButton/>
                    </div>
                </div>
        
                <FriendBlock name={"Joyce He"} last_seen={"10 days ago"}/>
                <FriendBlock name={"Melody Young"} last_seen={"2 days ago"}/>
                <FriendBlock name={"Emma Nguyen"} last_seen={"12 days ago"}/>
                <FriendBlock name={"Benjamin Liu"} last_seen={"12 days ago"}/>
            </div>
        </div>
    </>
}

export default FriendChecker;