import { UserPlus } from 'lucide-react';

type Prop = {
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>
}

function AddFriendButton({openAddFriends}: Prop) { 
    const handleClick = () => {
        openAddFriends(true);
    }

    return <>
        <div className="rounded-full bg-violet-500 w-2/9 h-7/8 flex justify-center items-center hover:ring-2 hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer" onClick={() => handleClick()}>
            <UserPlus/>
        </div>                                                             
    </>
}

export default AddFriendButton;