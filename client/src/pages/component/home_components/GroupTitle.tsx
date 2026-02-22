type Prop = {
    setFocused: React.Dispatch<React.SetStateAction<boolean>>,
    focused: boolean,
    setExtend: React.Dispatch<React.SetStateAction<boolean>>,
    groupName: string,
    setGroupName: React.Dispatch<React.SetStateAction<string>>,
}

function GroupTitle({setFocused, focused, setExtend, groupName, setGroupName}: Prop) {
    return <>
        <input type="text" onFocus={() => {setFocused(false); setExtend(false)}} value={groupName} onChange={(e) => setGroupName(e.currentTarget.value)} placeholder="Name Group" className={["h-[5vh] w-full focus:outline-0 flex text-center z-1000 text-black flex-1", focused ? "" : "font-bold"].join(" ")}/>
    </>
}

export default GroupTitle;