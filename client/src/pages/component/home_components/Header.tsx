import Logout from "./Logout";

function Header() {
    return (
        <div className="top-0 z-50 w-full bg-linear-to-b from-[#F5ECD7] to-[#ebdfc4] flex items-center justify-between pt-4"> 
            <div className="bg-linear-to-r to-[#3B1F0E] via-[#3B1F0E] from-[#F5ECD7] text-transparent bg-clip-text ml-[5vw] text-[2.5vw] font-bold bg-size-[200%] animate-colour-wave"> Sisyphus Scheduler </div>           
            <Logout/>
        </div>
    )
}

export default Header;
