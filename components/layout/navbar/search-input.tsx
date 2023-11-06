"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchInput = () => {
	const [value, setValue] = useState<string>("");
	const debouncedValue = useDebounce(value);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const currentCategoryId = searchParams.get("categoryId");
	useEffect(() => {
		// using debouncedValue to delay the starting of the query to no exhaust the server with querying each keystroke but wait half a second at least to start querying
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: { categoryId: currentCategoryId, title: debouncedValue },
			},
			{ skipEmptyString: true, skipNull: true }
		);
		router.push(url);
	}, [debouncedValue, router, pathname]);
	return (
		<div className="relative">
			<AiOutlineSearch className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
			<Input
				onChange={(e) => {
					setValue(e.target.value);
				}}
				value={value}
				className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
				placeholder="Search for a course"
			/>
		</div>
	);
};

export default SearchInput;
