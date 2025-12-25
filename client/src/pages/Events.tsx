import { useState } from 'react';
import SearchBar from './component/SearchBar';

function Events() {
    const [ value, setValue ] = useState("");

    return (
        <div className="flex justify-center items-center h-170">
            <div className="relative flex justify-center items-center">
                <SearchBar query={value} setQuery={setValue}></SearchBar>
                <button className="rounded-2xl bg-violet-200 h-9 w-20 absolute right-8 text-white hover:font-bold border-violet-500 hover:cursor-grab hover:shadow"> Enter </button>
            </div>
            
        </div>
    ) 

}

export default Events;