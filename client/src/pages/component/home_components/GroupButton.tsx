import { LayersPlus } from "lucide-react";

type prop = {
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}

// Add a div that group button is in - so as to ensure that NO friend blocks ever overlap w it. 
// Add add friends to the bottom as well --> maybe make a button that changes to two buttons. Idk think about it. Get back end first though.
// DO THIS NEXT SESSIon.

function GroupButton({openAddGroup}: prop) {
    const handleClick = () => {
        openAddGroup(true);
    }

    return <>
        <div className="rounded-full bg-violet-500 w-2/8 h-7/8 flex justify-center items-center hover:ring-2 hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer" onClick={() => handleClick()}>
            <LayersPlus/>
        </div>
    </>
}

export default GroupButton;