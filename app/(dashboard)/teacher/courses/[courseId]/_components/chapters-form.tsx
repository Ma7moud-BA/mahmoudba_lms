"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BiLoaderAlt, BiPencil } from "react-icons/bi";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChaptersList from "./chapters-list";
type Props = {
	initialData: Course & { chapters: Chapter[] };
};
const formSchema = z.object({
	// create the chapter by just its title then in a separate page update the required fields for the chapter
	title: z.string().min(1),
});
const ChaptersForm = ({ initialData }: Props) => {
	const [isCreating, setIsCreating] = useState<Boolean>(false);
	const [isUpdating, setIsUpdating] = useState<Boolean>(false);
	const toggleCreating = () => {
		setIsCreating((prev) => !prev);
	};
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "", // this form is for creating a new chapter so no need for initial value
		},
	});

	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${initialData.id}/chapters`, values);
			toast.success("Chapter Created");
			toggleCreating();
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};
	const handleOnReorder = async (
		updateData: { id: string; position: number }[]
	) => {
		try {
			setIsUpdating(true);
			await axios.put(`/api/courses/${initialData.id}/chapters/reorder`, {
				list: updateData,
			});
			toast.success("Chapter reordered");
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsUpdating(false);
		}
	};
	const handleOnEdit = (id: string) => {
		router.push(`/teacher/course/${initialData.id}/chapters/${id}`);
	};

	return (
		<div className=" relative mt-6 border bg-slate-100 rounded-md p-4">
			{isUpdating && (
				<div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center ">
					<BiLoaderAlt className="animate-spin text-sky-700 h-5 w-5"></BiLoaderAlt>
				</div>
			)}
			<div className="font-medium flex items-center justify-between">
				Course chapters
				<Button variant={"ghost"} onClick={toggleCreating}>
					{isCreating ? (
						<>cancel</>
					) : (
						<>
							<AiOutlinePlusCircle className="h-4 w-4 mr-2" />
							Add Chapter
						</>
					)}
				</Button>
			</div>

			{isCreating ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4  mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the course'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={!isValid || isSubmitting} type="submit">
							{" "}
							Create
						</Button>
					</form>
				</Form>
			) : (
				<>
					<div
						className={cn(
							"text-sm mt-2",
							!initialData.chapters.length && "text-slate-500 italic"
						)}
					>
						{!initialData.chapters.length && <div>No chapters</div>}
						<ChaptersList
							onEdit={handleOnEdit}
							onReorder={handleOnReorder}
							items={initialData.chapters || []}
						/>
					</div>
					<p className="text-xs text-muted-foreground mt-4">
						Drag and drop to reorder the chapters
					</p>
				</>
			)}
		</div>
	);
};

export default ChaptersForm;
