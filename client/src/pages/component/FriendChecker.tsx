import FriendBlock from "./FriendBlock";


function FriendChecker() {
    return <>
        <div className="flex-1 flex justify-center">
            <div className="border-2 border-violet-200 w-1/2 mt-10 bg-[#F1EDFF] overflow-y-scroll no-scrollbar shadow h-180 flex flex-col gap-5 pt-3"> 
                <div className="flex justify-center font-bold underline"> Friends </div>
                <FriendBlock name={"Joyce He"} last_seen={"10 days ago"}/>
                <FriendBlock name={"Melody Young"} last_seen={"2 days ago"}/>
                <FriendBlock name={"Emma Nguyen"} last_seen={"12 days ago"}/>
            </div>
        </div>
    </>
}

export default FriendChecker;