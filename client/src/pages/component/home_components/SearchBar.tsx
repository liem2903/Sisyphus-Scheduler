type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setValue:  React.Dispatch<React.SetStateAction<string>>,
    setReload: React.Dispatch<React.SetStateAction<boolean>>,
    clickButton: React.Dispatch<React.SetStateAction<boolean>>,
    value: string,
    reload: boolean
}

import { api } from "../../../interceptor/interceptor";

function SearchBar({query, setQuery, setReload, clickButton, setValue, value, reload}: Props) {
    const handleClick = async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key == "Enter") {
                if (value == "") {
                    clickButton(false);
                    return
                }
    
                await api.post('/auth/create-event', {value});
                setTimeout(endActions, 2000);
            }                      
        }
    
        const endActions = () => {
            setValue("");
            clickButton(false);
            setReload(!reload);
        }

    return (
        <input type="text" placeholder="Add your new event" className="bg-violet-300 w-[76vw] h-[10vh] rounded-2xl pl-2 pt-1 pb-1 border-2 focus:outline-0" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => handleClick(e)}/>
    )
}

export default SearchBar;