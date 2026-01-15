import HeaderButton from "./HeaderButton";
import Logout from "./Logout";

function Header() {
    return (
        <div className="sticky top-0 z-50 w-full h-[7vh] bg-[#181528] flex items-center justify-between mt-4"> 
            <div className="pl-15"> 
                <HeaderButton to="/home" page={"Home"}></HeaderButton>
            </div>
            <Logout/>
        </div>
    )
}

export default Header;
