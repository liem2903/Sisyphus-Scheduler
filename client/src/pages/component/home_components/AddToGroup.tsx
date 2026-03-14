import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../../interceptor/interceptor';
import type { groupFriends } from '../../../types/types';
import { Search } from 'lucide-react';

type Prop = {
    focused: boolean,
    setFocused: React.Dispatch<React.SetStateAction<boolean>>,
    extend: boolean,
    setExtend: React.Dispatch<React.SetStateAction<boolean>>,
    friend: groupFriends[],
    addFriend: React.Dispatch<React.SetStateAction<groupFriends[]>>
}

function AddToGroup({setFocused, focused, setExtend, extend, addFriend, friend}: Prop) {
    const [ friendName, setfriendName ] = useState("");
    const [ friendSuggestions, setSuggestions ] = useState<groupFriends[]>([])
    const [ chosenFriend, setChosenFriend ] = useState<groupFriends>();
    const [ errorMessage, setErrorMessage ] = useState("");

    const timer = useRef<number | undefined>(undefined);
    const input = useRef<HTMLInputElement | null>(null);

    const handleType = (name: string) => {
        clearTimeout(timer.current);

        timer.current = setTimeout(async () => {
            if (name == "") {
                setSuggestions([]);
                return
            } else {
                let data = await api.get('/friend/get-friend-from-name', {params: {name, exact: false}, withCredentials: true});
                let friends: groupFriends[] = data.data.friends;
                            
                setSuggestions(friends);
            }
        }, 250);
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, name: string) => {
        if (e.key === "Enter") {
            if (chosenFriend != undefined && !friend.some((x) => x.friend_id == chosenFriend.friend_id)) {
                setfriendName("");
                setSuggestions([]);
                addFriend([...friend, chosenFriend]);
                setChosenFriend(undefined);
            } else {
                try {
                    let data = await api.get('/friend/get-friend-from-name', {params: {name, exact: true}, withCredentials: true});
                    let addedFriend: groupFriends = data.data.friends[0];

                    if (!friend.some((x) => x.friend_id == addedFriend.friend_id)) {
                        setfriendName("");
                        setSuggestions([]);
                        addFriend([...friend, addedFriend]);
                    } else {
                        setfriendName("");
                        setSuggestions([]);
                    }

                    setChosenFriend(undefined);
                } catch (err: any) {
                    setfriendName("");
                    setChosenFriend(undefined);                
                    setErrorMessage(err.response.data.error);
                }
            }
        }
    }

    useEffect(() => {
        if (friendName.length > 0) {
            setExtend(true);
        } else {
            setExtend(false);
            setSuggestions([]);
        }

    }, [friendName]);

    return <>
        <div>
            <div className={["w-[clamp(13rem,25vw,100rem)] h-[5vh] flex flex-col rounded-[1vw]", extend ? "h-[25vh] overflow-y-scroll no-scrollbar" : "overflow-y-hidden", focused ? "bg-[#F5ECD7] shadow-[0_4px_25px_0_rgba(0,0,0,0.5)]": ""].join(" ")}>
            <input ref={input} type="text" onClick={() => setErrorMessage("")} onFocus={() => {setFocused(true); setErrorMessage("")}} onKeyDown={(e) => {setErrorMessage(""); handleKeyDown(e, e.currentTarget.value)}} value={friendName} placeholder='Add Friend' onChange={(e) => {setfriendName(e.currentTarget.value); handleType(e.currentTarget.value)}} className={["focus:outline-none rounded-full h-[5vh] w-full flex-none text-center text-black text-[clamp(0.8rem,0.8vw,50rem)]", focused ? "font-bold" : ""].join(" ")}/>
                {friendSuggestions.length > 0 && friendSuggestions.map((suggestions, index) => <div className={["text-black pl-[1vw] w-full h-[3vh] rounded-r-full hover:cursor-pointer hover:bg-gray-400/30 flex items-center gap-[0.5vw]", index == 0 ? "bg-gray-400/30" : ""].join(" ")} onClick={() => {setfriendName(suggestions.friend_name); setExtend(false); setChosenFriend(suggestions); input.current?.focus()}}> <Search size="15"/> <div className='pb-[0.25vh]'> {suggestions.friend_name} </div> </div>)}
                {friendSuggestions.length == 0 && extend && <div className="text-black pl-[1vw] w-full h-[3vh] rounded-r-full hover:cursor-pointer hover:bg-gray-400/30 flex items-center gap-[0.5vw] bg-gray-400/30" onClick={() => {setExtend(false); input.current?.focus()}}> <Search size="15"/> {friendName} </div>}
            </div>
            
            {errorMessage != "" && <div className="text-red-500 text-center"> {errorMessage} </div>}
        </div>

     </>
}   

export default AddToGroup;