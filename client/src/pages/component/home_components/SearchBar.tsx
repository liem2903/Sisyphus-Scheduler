type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
}

function SearchBar({query, setQuery}: Props) {
    return (
        <input type="text" placeholder="Add your new event" className="bg-violet-300 w-[76vw] h-[10vh] rounded-2xl pl-2 pt-1 pb-1 border-3 border-violet-600 shadow" value={query} onChange={(e) => setQuery(e.target.value)}/>
    )
}

export default SearchBar;