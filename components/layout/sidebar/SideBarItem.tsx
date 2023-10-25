"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
type SideBarItemProps = {
	icon: React.ComponentType;
	label: string;
	href: string;
};
const SideBarItem = ({ label, icon: Icon, href }: SideBarItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const isActive =
		(pathname === "/" && href === "/") ||
		pathname === href ||
		pathname?.startsWith(`${href}/`);

	const onClick = () => {
		router.push(href);
	};
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
				isActive &&
					"text-sky-700 bg-sky-200/20 hover:bg-sky-200 hover:text-sky-700"
			)}
		>
			<div className="text-2xl flex items-center gap-x-2 py-4">
				<Icon />
			</div>
			{label}
			<div
				className={cn(
					"ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
					isActive && " opacity-100"
				)}
			/>
		</Link>
	);
};

export default SideBarItem;
