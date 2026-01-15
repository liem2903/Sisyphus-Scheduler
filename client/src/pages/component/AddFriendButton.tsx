import { UserPlus } from 'lucide-react';

function AddFriendButton() {
    return <>
        <div className="rounded-full w-1/4 flex justify-center items-center hover:bg-amber-50 hover:cursor-pointer">
            <UserPlus size="15"/>
        </div>
    </>
}

export default AddFriendButton;