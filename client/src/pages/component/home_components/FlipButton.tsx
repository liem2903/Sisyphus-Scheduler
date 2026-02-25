type Prop = {
    flipOver: React.Dispatch<React.SetStateAction<boolean>>,
    flipped: boolean,
    cantFlip: boolean,
}

import { ArrowLeftRight } from "lucide-react"

function FlipButton({flipOver, flipped, cantFlip}: Prop) {
    return <>
        <button disabled={cantFlip} className= {flipped ? "rounded-full w-[1vw] h-[1vh] flex justify-center items-center hover:cursor-pointer absolute right-[0.25vw] top-[0.75vh]" : "rounded-full w-[1vw] h-[1vh] flex justify-center items-center hover:cursor-pointer absolute left-[0.25vw] top-[0.75vh]" } onClick={() => {flipOver(!flipped)}}> <ArrowLeftRight size={'1vw'}/> </button> 
    </>
}

export default FlipButton;