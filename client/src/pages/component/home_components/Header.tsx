import Logout from "./Logout";

function Header() {
    return (
        <div className="top-0 z-50 w-full bg-[#0e0a08] flex items-center justify-between pt-4"> 
            <div className="bg-linear-to-r from-fuchsia-300 via-violet-400 to-violet-950 text-transparent bg-clip-text ml-[5vw] text-[2.5vw] font-bold bg-size-[200%] animate-colour-wave"> Sisyphus Scheduler </div>           
            <Logout/>
        </div>
    )
}

export default Header;
