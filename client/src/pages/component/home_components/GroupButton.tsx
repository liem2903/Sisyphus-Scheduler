import { LayersPlus } from "lucide-react";

type prop = {
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}


function GroupButton({openAddGroup}: prop) {
    const handleClick = () => {
        openAddGroup(true);
    }

    return <>
        <div className="rounded-full hover:bg-[violet-300] w-2/8 h-7/8 flex justify-center items-center hover:ring-2 text-[#4A7C59] hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer shadow-2xl" onClick={() => handleClick()}>
            <LayersPlus/>
        </div>
    </>
}

export default GroupButton;