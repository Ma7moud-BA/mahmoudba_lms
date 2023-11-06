"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import SearchInput from "./search-input";

const NavBarRoutes = () => {
	const pathname = usePathname();
	const isTeacherPage = pathname?.startsWith("/teacher");
	//individual course page
	const isPlayerPage = pathname?.includes("/chapter");
	const isSearchPage = pathname === "/search";

	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-2 ml-auto">
				{isTeacherPage || isPlayerPage ? (
					<Link href={"/"}>
						<Button size="sm" variant="ghost">
							<AiOutlineLogout className="h-4 w-4 mr-2" /> Exit
						</Button>
					</Link>
				) : (
					<Link href={"/teacher/courses"}>
						<Button size="sm" variant="ghost">
							Teacher Mode
						</Button>
					</Link>
				)}
				<UserButton afterSignOutUrl="/"></UserButton>
			</div>
		</>
	);
};

export default NavBarRoutes;
