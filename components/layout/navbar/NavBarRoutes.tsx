"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import SearchInput from "./search-input";
import { isTeacher } from "@/actions/teacher";

const NavBarRoutes = () => {
	const pathname = usePathname();
	const isTeacherPage = pathname?.startsWith("/teacher");
	//individual course page
	const isCoursePage = pathname?.includes("/courses");
	const isSearchPage = pathname === "/search";
	const { userId } = useAuth();
	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-2 ml-auto">
				{isTeacherPage || isCoursePage ? (
					<Link href={"/"}>
						<Button size="sm" variant="ghost">
							<AiOutlineLogout className="h-4 w-4 mr-2" /> Exit
						</Button>
					</Link>
				) : (
					isTeacher(userId) && (
						<Link href={"/teacher/courses"}>
							<Button size="sm" variant="ghost">
								Teacher Mode
							</Button>
						</Link>
					)
				)}
				<UserButton afterSignOutUrl="/"></UserButton>
			</div>
		</>
	);
};

export default NavBarRoutes;
