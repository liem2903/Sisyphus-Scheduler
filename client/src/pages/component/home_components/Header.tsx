import Logout from "./Logout";

function Header() {
    return (
        <div className="sticky top-0 z-50 w-full h-[7vh] bg-[#181528] flex items-center justify-end mt-4">            
            <Logout/>
        </div>
    )
}

export default Header;
