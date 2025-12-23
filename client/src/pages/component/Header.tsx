
function Header() {
    return (
        <div className="sticky top-0 z-50 w-full h-10 bg-violet-300 flex justify-end shadow items-center"> 
            <button className="text-1xl mr-20 text-black rounded-lg hover:cursor-grab hover:bg-gray-300 pr-2 pl-2 p-b-1 p-t-1"> Log out </button>
        </div>
    )
}

export default Header;
