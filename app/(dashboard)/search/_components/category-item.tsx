"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import qs from "query-string";
type Props = {
	label: string;
	icon: IconType;
	value: string;
};
const CategoryItem = ({ label, icon: Icon, value }: Props) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchPrams = useSearchParams();
	const currentCategoryId = searchPrams.get("categoryId");
	const currentTitle = searchPrams.get("title");
	const isSelected = currentCategoryId === value;

	const handleOnClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isSelected ? null : value,
				},
			},
			{ skipNull: true, skipEmptyString: true }
		);
		router.push(url);
	};
	return (
		<Button
			onClick={handleOnClick}
			className={cn(
				"py-2 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
				isSelected && "border-s-sky-700 bg-sky-200/20 text-sky-800"
			)}
			variant={"outline"}
			type="button"
		>
			{Icon && <Icon size={20} />} <div className="truncate ml-2 ">{label}</div>{" "}
		</Button>
	);
};

export default CategoryItem;
