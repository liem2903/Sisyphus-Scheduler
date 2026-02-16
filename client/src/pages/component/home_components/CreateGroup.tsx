import GroupTitle from "./GroupTitle";

type prop = {
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}

function CreateGroup({openAddGroup}: prop) {
    return <>
        <div className="flex justify-center items-center inset-0 absolute">
           <div className="z-999 bg-black/50 absolute inset-0" onClick={() => openAddGroup(false)}> </div>
           <div className="w-[55vw] h-[40vw] z-1000 bg-violet-400 absolute flex items-center flex-col">
                <GroupTitle/>
            </div>
        </div>
    </>
}

export default CreateGroup;