import { api } from "../../../interceptor/interceptor";
import AddFriendButton from "./AddFriendButton";
import FriendBlock from "./FriendBlock";
import RequestsButton from "./RequestsButton";
import React, { useEffect, useState } from 'react';
import { type friends, type friendRequest, type busyDates, type groupIds, type groupInfo, type usedGroupInfo } from "../../../types/types";
import Spinner from "../global_components/Spinner";
import GroupButton from "./GroupButton";
import GroupBlock from "./GroupBlock";

type Prop = {
    openCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    openGroupCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    setBusyDates: React.Dispatch<React.SetStateAction<busyDates[]>>,
    startWeek: String,
    endWeek: String,
    setCalendarId:  React.Dispatch<React.SetStateAction<string>>,
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>,
    setGroupCalendarId: React.Dispatch<React.SetStateAction<string[]>>,
}

// I need to pass 

function FriendChecker({openCalendar, openGroupCalendar, setBusyDates, startWeek, endWeek, setCalendarId, openAddGroup, setGroupCalendarId}: Prop) {
    const [ friendRequests, setFriendRequests ] = useState<friendRequest[]>([]);
    const [ friendlist, setFriendList ] = useState<friends[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ groups, setGroups ] = useState<usedGroupInfo[]>([]);

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
        }

        const getGroups = async () => {
            let data = await api.get('/group/get-group-ids', {withCredentials: true});
            let group_ids = data.data.data;

            let groups = await Promise.all(group_ids.map(async (group_id: groupIds) => {
                let data = await api.get('/group/get-group', {params: {group_id: group_id.group_id}, withCredentials: true});
                let group_data: groupInfo = data.data.data;

                let duration = (await api.get(`/friend/get-last-seen`, {params: { name: group_data.group_name }, withCredentials: true})).data.data;
                let new_seen = ""
                
                if (duration.last_seen == "Untracked") {
                    new_seen = `${duration.last_seen}`;
                } else if (parseInt(duration.last_seen) > 1) {
                    new_seen = `${duration.last_seen} days ago`;
                } else {
                    new_seen = `${duration.last_seen} day ago`;
                }

                return {
                    group_name: group_data.group_name,
                    user_ids: group_data.user_ids,
                    last_seen: new_seen,
                    status: duration.status,
                    id: group_id.group_id,
                };
            }));

            setGroups(groups);
            setLoading(false);
        }
        
        getNotifications();
        getFriends();
        getGroups();
    }, [])

    return <>
        <div className="flex justify-center w-[30vw]">
            <div className="border-2 border-violet-600 w-4/5 mt-10 bg-violet-300 overflow-y-scroll no-scrollbar shadow h-[80vh] flex flex-col gap-5 pt-3 relative">
                {loading ? <Spinner/> : 
                    <div className="flex">
                        <div className="flex justify-end font-bold underline w-3/5"> 
                            Friends 
                        </div>
                        <div className="flex-1 flex justify-center gap-x-2"> 
                            <RequestsButton friendRequests={friendRequests} setRequests={setFriendRequests}/>
                            <AddFriendButton/>
                        </div>
                        <div className="w-full absolute pb-[1vh] bottom-0 flex flex-row-reverse pr-[0.5vw] items-center">
                            <GroupButton openAddGroup={openAddGroup}/>
                        </div>
                    </div>
                }

                {loading ? <div></div> : friendlist.map((val) =>  <FriendBlock setCalendarId={setCalendarId} openCalendar={openCalendar} last_seen={val.last_seen != "Untracked" ? (parseInt(val.last_seen) > 1 ? `${val.last_seen} days ago` : `${val.last_seen} day ago`) : val.last_seen} id={val.id} changed_name={val.changed_name} status={val.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek}/>)}

                <div className="flex justify-end font-bold underline w-3/5 shadow-2xl"> 
                    Groups 
                </div>

                {loading ? <div></div> : groups.map((group) => <GroupBlock setGroupCalendarId={setGroupCalendarId} openGroupCalendar={openGroupCalendar} last_seen={group.last_seen} id={group.user_ids} changed_name={group.group_name} status={group.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} groupId={group.id}></GroupBlock>)}
            </div>
        </div>
    </>
}

export default FriendChecker;