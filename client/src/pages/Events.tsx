import { useState } from 'react';
import SearchBar from './component/SearchBar';
import { api } from '../interceptor/interceptor';

function Events() {
    const [ value, setValue ] = useState("");
    const [ clicked, clickButton ] = useState(false);

    const handleClick = async () => {
        if (value == "") {
            clickButton(false);
            return
        }

        await api.post('/auth/create-event', {value});
        setValue("");
        clickButton(false);
    }

    return (
        <div className="flex justify-center items-center h-170">
            <div className="relative flex justify-center items-center">
                <SearchBar query={value} setQuery={setValue}></SearchBar>
                <button className="rounded-2xl bg-violet-200 h-9 w-20 absolute right-8 text-white hover:font-bold border-violet-500 hover:cursor-grab hover:shadow" disabled={clicked} onClick={() => {clickButton(true); handleClick()}}> Enter </button>
            </div>
        </div>
    ) 

}

export default Events;