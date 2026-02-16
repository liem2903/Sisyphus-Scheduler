import { useState } from 'react';

function GroupTitle() {
    const [ groupName, setGroupName ] = useState("");

    return <>
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.currentTarget.value)} placeholder="Group Name" className="h-[5vh] w-[35vw] focus:outline-0 mt-5 flex text-center z-1000 bg-white text-black shadow-2xl"/>
    </>
}

export default GroupTitle;