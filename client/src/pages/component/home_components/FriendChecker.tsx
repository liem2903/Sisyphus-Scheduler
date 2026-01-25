import { api } from "../../../interceptor/interceptor";
import AddFriendButton from "./AddFriendButton";
import FriendBlock from "./FriendBlock";
import RequestsButton from "./RequestsButton";
import { useEffect, useState } from 'react';
import { type friends, type friendRequest } from "../../../types/types";
import Spinner from "../global_components/Spinner";

function FriendChecker() {
    const [ friendRequests, setFriendRequests ] = useState<friendRequest[]>([]);
    const [ friendlist, setFriendList ] = useState<friends[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);

        const getNotifications = async () => {             
            const requests = await api.get('/friend/get-friend-requests', {withCredentials: true});
            let data: friendRequest[] = requests.data.data;
            let friendRequests: friendRequest[] = []
            
            data.map(req => friendRequests.push(req));
            setFriendRequests(friendRequests);
        }

        const getFriends = async () => {
            const list = await api.get('/friend/get-friends', {withCredentials: true});
            setFriendList(list.data.data);
            setLoading(false);
        }
        
        getNotifications();
        getFriends();
    }, [])

    return <>
        <div className="flex-1 flex justify-center">
            <div className="border-2 border-violet-600 w-4/5 mt-10 bg-violet-300 overflow-y-scroll no-scrollbar shadow h-[80vh] flex flex-col gap-5 pt-3">
                {loading ? <Spinner/> : 
                    <div className="flex">
                        <div className="flex justify-end font-bold underline w-3/5"> 
                            Friends 
                        </div>
                        <div className="flex-1 flex justify-center gap-x-2"> 
                            <RequestsButton friendRequests={friendRequests} setRequests={setFriendRequests}/>
                            <AddFriendButton/>
                        </div>
                    </div>
                }

                {loading ? <div></div> : friendlist.map((val) =>  <FriendBlock last_seen={val.last_seen != "Untracked" ? (parseInt(val.last_seen) > 1 ? `${val.last_seen} days ago` : `${val.last_seen} day ago`) : val.last_seen} id={val.id} changed_name={val.changed_name} status={val.status}/>)}
            </div>
        </div>
    </>
}

export default FriendChecker;