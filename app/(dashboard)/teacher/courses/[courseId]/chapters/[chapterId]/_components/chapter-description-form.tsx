"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BiPencil } from "react-icons/bi";
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
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
type Props = {
	initialData: Chapter;
	chapterId: string;
	courseId: string;
};
const formSchema = z.object({
	description: z.string(),
});
const ChapterDescriptionForm = ({
	initialData,
	chapterId,
	courseId,
}: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData.description || "", // Convert null to an empty string
		},
	});

	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast.success("Chapter Updated");
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter description
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing ? (
						<>cancel</>
					) : (
						<>
							<BiPencil className="h-4 w-4 mr-2" />
							Edit title
						</>
					)}
				</Button>
			</div>

			{isEditing ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4  mt-4"
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Editor {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting}> Save</Button>
						</div>
					</form>
				</Form>
			) : (
				<div
					className={cn(
						"text-sm ml-2",
						!initialData.description && "text-slate-700 italic"
					)}
				>
					{initialData.description ? (
						<Preview value={initialData.description} />
					) : (
						"No description"
					)}
				</div>
			)}
		</div>
	);
};

export default ChapterDescriptionForm;
