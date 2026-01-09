type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
}

function SearchBar({query, setQuery}: Props) {
    return (
        <input type="text" placeholder="Add your new event" className="bg-white w-295 h-17 rounded-2xl pl-2 pt-1 pb-1 border-5 border-violet-200 shadow" value={query} onChange={(e) => setQuery(e.target.value)}/>
    )
}

export default SearchBar;