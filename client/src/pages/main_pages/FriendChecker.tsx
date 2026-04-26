import { api } from "../../interceptor/interceptor";
import AddFriendButton from "../component/home_components/AddFriendButton";
import FriendBlock from "../component/home_components/FriendBlock";
import RequestsButton from "../component/home_components/RequestsButton";
import React, { useEffect, useState } from 'react';
import { type friends, type friendRequest, type busyDates, type groupIds, type groupInfo, type usedGroupInfo } from "../../types/types";
import GroupButton from "../component/home_components/GroupButton";
import GroupBlock from "../component/home_components/GroupBlock";
import FriendCheckerSkeleton from "../component/skeleton_components/friend_skeleton/FriendCheckerSkeleton";
import UnfriendButton from "../component/home_components/UnfriendButton";

type Prop = {
    openCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    openGroupCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    setBusyDates: React.Dispatch<React.SetStateAction<busyDates[]>>,
    startWeek: string,
    endWeek: string,
    setCalendarId:  React.Dispatch<React.SetStateAction<string>>,
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>,
    setGroupCalendarId: React.Dispatch<React.SetStateAction<string[]>>,
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>,
    openUnfriend: React.Dispatch<React.SetStateAction<boolean>>,
    setUnfriendId: React.Dispatch<React.SetStateAction<string>>,
    friendlist: friends[],
    setFriendList: React.Dispatch<React.SetStateAction<friends[]>>,
    setGroupDelete: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletedGroup: React.Dispatch<React.SetStateAction<string>>, 
    groups: usedGroupInfo[],
    setGroups: React.Dispatch<React.SetStateAction<usedGroupInfo[]>>,
    setDeletedFriendName: React.Dispatch<React.SetStateAction<string>>,
    setDeletedGroupName: React.Dispatch<React.SetStateAction<string>>,
}

function FriendChecker({setDeletedFriendName, friendlist, setFriendList, setUnfriendId, openCalendar, openGroupCalendar, setBusyDates, startWeek, endWeek, setCalendarId, openAddGroup, setGroupCalendarId, openAddFriends, openUnfriend, setGroupDelete, setDeletedGroup, groups, setGroups, setDeletedGroupName}: Prop) {
    const [ friendRequests, setFriendRequests ] = useState<friendRequest[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ trash, setTrashMode ] = useState(false);

    useEffect(() => {
        setLoading(true);

        const getNotifications = async () => {             
            const requests = await api.get('/friend/get-friend-requests', {withCredentials: true});
            const data: friendRequest[] = requests.data.data;
            const friendRequests: friendRequest[] = []
            
            data.map(req => friendRequests.push(req));
            setFriendRequests(friendRequests);
        }

        const getFriends = async () => {
            const list = await api.get('/friend/get-friends', {withCredentials: true});
            setFriendList(list.data.data);
        }

        const getGroups = async () => {
            const data = await api.get('/group/get-group-ids', {withCredentials: true});
            const group_ids = data.data.data;

            const groups = await Promise.all(group_ids.map(async (group_id: groupIds) => {
                const data = await api.get('/group/get-group', {params: {group_id: group_id.group_id}, withCredentials: true});
                const group_data: groupInfo = data.data.data;

                const duration = (await api.get(`/friend/get-last-seen`, {params: { name: group_data.group_name }, withCredentials: true})).data.data;
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
    <div className="flex justify-center w-full lg:flex-1 mx-4 lg:mx-[2vw] pt-4 lg:pt-[5vh] pb-4 lg:pb-0 text-[#572e15]">
        <div className="border border-[#4A7C59] bg-[#3B1F0E] overflow-clip h-[60vh] lg:h-[81vh] flex flex-col w-full lg:w-[clamp(0.5em,15vw,100rem)] rounded-2xl lg:rounded-[1vw] shadow-[0_4px_25px_0_rgba(0,0,0,0.2)]">                   
            <div className="h-full flex flex-col">
                <div className="flex-col gap-2 lg:gap-[1vw] flex overflow-y-scroll no-scrollbar h-[50vh] lg:h-[73vh]">
                    <div className={["flex sticky top-0 z-[1006] bg-[#3B1F0E] pt-2 lg:pt-[1vh]", trash ? "bg-[#3B1F0E]" : ""].join(" ")}> 
                        <div className="flex justify-end font-bold underline w-3/5 text-sm lg:text-[clamp(0.5rem,1vw,5rem)] text-[#FFF8F0]">
                            Friends 
                        </div>    
                        <div className="flex flex-1 justify-end pr-3 lg:pr-[1vw]">
                            <RequestsButton friendRequests={friendRequests} setRequests={setFriendRequests} setFriendList={setFriendList}/>
                        </div>
                    </div>
                    {friendlist.map((val) =>  <FriendBlock key={val.id} setDeletedFriendName={setDeletedFriendName} setUnfriendId={setUnfriendId} openUnfriend={openUnfriend} trash={trash} setCalendarId={setCalendarId} openCalendar={openCalendar} last_seen={val.last_seen != "Untracked" ? (parseInt(val.last_seen) > 1 ? `${val.last_seen} days ago` : `${val.last_seen} day ago`) : val.last_seen} id={val.id} changed_name={val.changed_name} status={val.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek}/>)}
                    {groups.map((group) => <GroupBlock key={group.id} setDeletedGroupName={setDeletedGroupName} setGroupDelete={setGroupDelete} setDeletedGroup={setDeletedGroup} trash={trash} setGroupCalendarId={setGroupCalendarId} openGroupCalendar={openGroupCalendar} last_seen={group.last_seen} id={group.user_ids} changed_name={group.group_name} status={group.status} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} groupId={group.id}></GroupBlock>)}
                </div>     

                <div className="flex justify-end pr-4 lg:pr-[2vw] items-center gap-x-2 lg:gap-x-[0.5vw] flex-1 py-3 lg:py-0">
                    <GroupButton openAddGroup={openAddGroup}/> 
                    <AddFriendButton openAddFriends={openAddFriends}/>
                    <UnfriendButton setTrashMode={setTrashMode} trash={trash}/>
                </div>               
            </div>                      
        </div>
    </div> }
</>
}

export default FriendChecker;