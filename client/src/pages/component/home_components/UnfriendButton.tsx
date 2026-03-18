import { Trash } from "lucide-react";

type Prop = {
    setTrashMode: React.Dispatch<React.SetStateAction<boolean>>,
    trash: boolean,
}

export default function UnfriendButton({setTrashMode, trash}: Prop) {
    return <>
        <div className="rounded-full text-[#4A7C59] w-2/9 mt-[1vh] flex justify-center items-center hover:ring-2 hover:ring-[#4A7C59]/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer shadow-2xl" onClick={() => setTrashMode(!trash)}>
            <Trash/>
        </div>          
    </>
}