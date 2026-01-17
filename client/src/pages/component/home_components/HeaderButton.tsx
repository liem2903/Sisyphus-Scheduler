import { NavLink } from "react-router-dom";

type HeaderButtonProps = {
  to: string,
  page: string
}

function HeaderButton({to, page}: HeaderButtonProps ) {
    return (
        <NavLink to={to} className={({isActive}) => 
            isActive ? "underline mr-10 text-white text-shadow-2xs rounded-2xl hover:cursor-pointer hover:bg-gray-300 mt-3 pr-2 pl-2 pb-2 pt-2 font-bold text-lg" : "text-lg mr-10 text-white rounded-2xl text-shadow-2xs hover:cursor-hover hover:bg-gray-300 mt-3 pr-2 pl-2 pb-2 pt-2 font-normal"}>
            {page} 
        </NavLink>
    )
}

export default HeaderButton;
