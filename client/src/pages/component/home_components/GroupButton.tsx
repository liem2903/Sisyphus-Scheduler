import { LayersPlus } from "lucide-react";

type prop = {
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}

// Add a div that group button is in - so as to ensure that NO friend blocks ever overlap w it. 
// Add add friends to the bottom as well --> maybe make a button that changes to two buttons. Idk think about it. Get back end first though.


function GroupButton({openAddGroup}: prop) {
    const handleClick = () => {
        openAddGroup(true);
    }

    return <>
        <div className="rounded-full bg-violet-600 w-1/8 h-1/24 flex justify-center items-center hover:bg-violet-900 absolute right-10 bottom-3 hover:cursor-pointer" onClick={() => handleClick()}>
            <LayersPlus/>
        </div>
    </>
}

export default GroupButton;