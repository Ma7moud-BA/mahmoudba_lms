"use client";
import React from "react";
import SideBarItem from "./SideBarItem";
import { Compass, Layout } from "lucide-react";
import {
	AiOutlineBarChart,
	AiOutlineCompass,
	AiOutlineLayout,
	AiOutlineUnorderedList,
} from "react-icons/ai";
import { usePathname } from "next/navigation";
import path from "path";

const guestRoutes = [
	{ icon: AiOutlineLayout, label: "Dashboard", href: "/" },
	{ icon: AiOutlineCompass, label: "Browse", href: "/search" },
];
const teacherRoutes = [
	{ icon: AiOutlineUnorderedList, label: "Courses", href: "/teacher/courses" },
	{ icon: AiOutlineBarChart, label: "Analytics", href: "/teacher/analytics" },
];

const SideBarRoutes = () => {
	const pathname = usePathname();
	const isTeacherPage = pathname.includes("/teacher");
	const routes = isTeacherPage ? teacherRoutes : guestRoutes;
	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => (
				<SideBarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
};

export default SideBarRoutes;
