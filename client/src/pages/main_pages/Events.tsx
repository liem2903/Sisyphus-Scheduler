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
        <div className="flex items-center ml-20 mt-10">
            <div className="relative flex justify-center items-center">
                <SearchBar query={value} setQuery={setValue}></SearchBar>
                <button className="rounded-2xl bg-violet-600 border-2 border-[#181528] h-3/5 w-1/16 absolute right-1/20 text-white hover:font-bold hover:cursor-pointer hover:shadow" disabled={clicked} onClick={() => {clickButton(true); handleClick()}}> Enter </button>
            </div>
        </div>
    ) 

}

export default Events;