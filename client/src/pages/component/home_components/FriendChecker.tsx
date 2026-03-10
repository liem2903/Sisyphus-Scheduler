import { api } from "../../../interceptor/interceptor";
import AddFriendButton from "./AddFriendButton";
import FriendBlock from "./FriendBlock";
import RequestsButton from "./RequestsButton";
import React, { useEffect, useState } from 'react';
import { type friends, type friendRequest, type busyDates, type groupIds, type groupInfo, type usedGroupInfo } from "../../../types/types";
import GroupButton from "./GroupButton";
import GroupBlock from "./GroupBlock";
import FriendCheckerSkeleton from "../skeleton_components/friend_skeleton/FriendCheckerSkeleton";

type Prop = {
    openCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    openGroupCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    setBusyDates: React.Dispatch<React.SetStateAction<busyDates[]>>,
    startWeek: String,
    endWeek: String,
    setCalendarId:  React.Dispatch<React.SetStateAction<string>>,
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>,
    setGroupCalendarId: React.Dispatch<React.SetStateAction<string[]>>,
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>,
}

function FriendChecker({openCalendar, openGroupCalendar, setBusyDates, startWeek, endWeek, setCalendarId, openAddGroup, setGroupCalendarId, openAddFriends}: Prop) {
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
        }
                
        Promise.all([getNotifications(), getFriends(), getGroups()]).then(() => {
            setLoading(false);
        });
    }, [])

    return <>
        {loading ? <FriendCheckerSkeleton/> :
        <div className="flex justify-center flex-1 ml-[2vw] mr-[2vw] pt-[5vh] text-[#572e15]">
            <div className="border border-[#4A7C59] bg-[#3B1F0E] overflow-clip h-[80vh] flex flex-col w-[clamp(0.5em,15vw,100rem)] rounded-[1vw]">                   
                <div>
                    <div className="flex-col gap-[1vw] flex overflow-y-scroll no-scrollbar h-[73vh] pt-[1vh]">
                        <div className="flex sticky top-0 z-1006 bg-[#3B1F0E]"> 
                            <div className="flex justify-end font-bold underline w-3/5 text-[clamp(0.5rem,1vw,5rem)] text-[#FFF8F0]">
                                Friends 
                            </div>    
                            <div className="flex flex-1 justify-end pr-[1vw]">
                                <RequestsButton friendRequests={friendRequests} setRequests={setFriendRequests} setFriendList={setFriendList}/>
                            </div>
                        </div>
                        {friendlist.map((val) =>  <FriendBlock setCalendarId={setCalendarId} openCalendar={openCalendar} last_seen={val.last_seen != "Untracked" ? (parseInt(val.last_seen) > 1 ? `${val.last_seen} days ago` : `${val.last_seen} day ago`) : val.last_seen} id={val.id} changed_name={val.changed_name} status={val.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek}/>)}
                        {groups.map((group) => <GroupBlock setGroupCalendarId={setGroupCalendarId} openGroupCalendar={openGroupCalendar} last_seen={group.last_seen} id={group.user_ids} changed_name={group.group_name} status={group.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} groupId={group.id}></GroupBlock>)}
                    </div>
                    
                    <div className="flex justify-end pr-[0.5vw] items-center h-[5vh] gap-x-[0.5vw]">
                        <GroupButton openAddGroup={openAddGroup}/> 
                        <AddFriendButton openAddFriends={openAddFriends}/>
                    </div>
                </div>
                
            </div>
        </div> }
    </>
}

export default FriendChecker;