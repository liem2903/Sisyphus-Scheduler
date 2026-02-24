import { UserPlus } from 'lucide-react';

type Prop = {
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>
}

function AddFriendButton({openAddFriends}: Prop) { 
    const handleClick = () => {
        openAddFriends(true);
    }

    return <>
        <div className="rounded-full bg-violet-500 w-2/9 h-7/8 flex justify-center items-center hover:bg-violet-600 hover:cursor-pointer" onClick={() => handleClick()}>
            <UserPlus/>
        </div>                                                             
    </>
}

export default AddFriendButton;