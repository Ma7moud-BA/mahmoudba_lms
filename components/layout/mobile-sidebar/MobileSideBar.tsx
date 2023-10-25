import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "../sidebar/SideBar";
const MobileSideBar = () => {
	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<AiOutlineMenu size={25}></AiOutlineMenu>
			</SheetTrigger>
			<SheetContent side="left" className="p-0 bg-white">
				<SideBar />
			</SheetContent>
		</Sheet>
	);
};

export default MobileSideBar;
