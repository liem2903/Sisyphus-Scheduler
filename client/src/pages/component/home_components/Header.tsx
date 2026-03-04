import Logout from "./Logout";

function Header() {
    return (
        <div className="sticky top-0 z-50 w-full h-[7vh] bg-[#181528] flex items-center justify-between mt-4"> 
            <div className="text-violet-400 ml-[5vw] text-[2.5vw] font-bold"> Sisyphus Scheduler </div>           
            <Logout/>
        </div>
    )
}

export default Header;
