import HeaderButton from "./HeaderButton";
import Logout from "./Logout";

function Header() {
    return (
        <div className="sticky top-0 z-50 w-full h-14 bg-violet-300 flex items-center justify-between mt-4"> 
            <div className="pl-15"> 
                <HeaderButton to="/home" page={"Home"}></HeaderButton>
                <HeaderButton to="/settings" page={"Settings"}></HeaderButton>
            </div>
            <Logout/>
        </div>
    )
}

export default Header;
