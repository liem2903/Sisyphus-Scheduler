import { UserPlus } from 'lucide-react';

function AddFriendButtonSkeleton() { 
    return <>
        <div className="rounded-full text-[#4A7C59] w-2/9 h-7/8 flex justify-center items-center">
            <UserPlus/>
        </div>                                                             
    </>
}

export default AddFriendButtonSkeleton;