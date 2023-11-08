"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import {
	AiFillLock,
	AiOutlineCheckCircle,
	AiOutlinePlayCircle,
} from "react-icons/ai";

type Props = {
	id: string;
	label: string;
	isComplete: boolean;
	courseId: string;
	isLocked: boolean;
};
const CourseSideBarItem = ({
	id,
	label,
	isComplete,
	courseId,
	isLocked,
}: Props) => {
	const pathname = usePathname();
	const router = useRouter();
	const Icon: IconType = isLocked
		? AiFillLock
		: isComplete
		? AiOutlineCheckCircle
		: AiOutlinePlayCircle;
	const isActive = pathname?.includes(id);
	const handleOnClick = () => {
		router.push(`/courses/${courseId}/chapters/${id}`);
	};
	return (
		<button
			type="button"
			className={cn(
				"flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
				isActive &&
					"text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
				isComplete && "text-emerald-700 hover:text-emerald-700",
				isComplete && isActive && " bg-emerald-200/20"
			)}
			onClick={handleOnClick}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn(
						"text-sky-500",
						isActive && "text-slate-700",
						isComplete && "text-emerald-700"
					)}
				/>
				{label}
			</div>
			<div
				className={cn(
					"ml-auto opacity-0 border-2  border-slate-700 h-full transition-all",
					isActive && " opacity-100 text-emerald-700 hover:text-emerald-700",
					isComplete && "border-emerald-700"
				)}
			/>
		</button>
	);
};

export default CourseSideBarItem;
