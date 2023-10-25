import React from "react";
import MobileSideBar from "../mobile-sidebar/MobileSideBar";
import NavBarRoutes from "./NavBarRoutes";

const NavBar = () => {
	return (
		<div className="p-4 border-b h-full  items-center flex bg-white shadow-sm z-50">
			<MobileSideBar />
			<NavBarRoutes />
		</div>
	);
};

export default NavBar;
