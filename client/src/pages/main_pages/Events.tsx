import { useState } from 'react';
import SearchBar from '../component/home_components/SearchBar';
import { api } from '../../interceptor/interceptor';

type prop = {
    reload: boolean,
    setReload: React.Dispatch<React.SetStateAction<boolean>> 
}

function Events({reload, setReload}: prop) {
    const [ value, setValue ] = useState("");
    const [ clicked, clickButton ] = useState(false);

    const handleClick = async () => {
        if (value == "") {
            clickButton(false);
            return
        }

        await api.post('/auth/create-event', {value});
        setTimeout(endActions, 2000);
    }

    const endActions = () => {
        setValue("");
        clickButton(false);
        setReload(!reload);
    }

    return (
        <div className="flex items-center ml-[3vw] mt-[5vh]">
            <div className="relative flex justify-center items-center">
                <SearchBar query={value} setQuery={setValue} setReload={setReload} reload={reload} value={value} setValue={setValue} clickButton={clickButton}></SearchBar>
                <button className={["rounded-[4vw] bg-violet-400 border-[#181528] h-3/5 absolute right-1/40 text-black font-bold text-[clamp(1rem,1vw,7rem)] w-[clamp(3rem,5vw,10rem)] shadow-2xl", clicked ? "bg-violet-400/30 text-black/30" : " hover:ring-2 hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer" ].join(" ")} disabled={clicked} onClick={() => {clickButton(true); handleClick()}}> <div className=''> Enter </div> </button>
            </div>
        </div>
    ) 

}

export default Events;