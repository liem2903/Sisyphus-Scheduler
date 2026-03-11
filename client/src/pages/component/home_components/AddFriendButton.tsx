import { UserPlus } from 'lucide-react';

type Prop = {
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>
}

function AddFriendButton({openAddFriends}: Prop) { 
    const handleClick = () => {
        openAddFriends(true);
    }

    return <>
        <div className="rounded-full text-[#4A7C59] w-2/9 mt-[1vh] flex justify-center items-center hover:ring-2 hover:ring-[#4A7C59]/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer shadow-2xl" onClick={() => handleClick()}>
            <UserPlus/>
        </div>                                                             
    </>
}

export default AddFriendButton;