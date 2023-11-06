"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { BiPencil } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price") || "0");
			const formattedPrice = formatPrice(price);
			return <div>{formattedPrice}</div>;
		},
	},
	{
		accessorKey: "isPublished",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Published
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const isPublished = row.getValue("isPublished") || false;
			return (
				<Badge className={cn("bg-slate-500", isPublished && "bg-sky-500")}>
					{isPublished ? "Published" : "Draft"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { id } = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"ghost"} className="h-4 w-8 p-0">
							{/* <span className="sr-only">Open Menu</span> */}
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Link href={`/teacher/courses/${id}`}>
							<DropdownMenuItem>
								<BiPencil className="h-4 w-4 m-2" />
								Edit
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
