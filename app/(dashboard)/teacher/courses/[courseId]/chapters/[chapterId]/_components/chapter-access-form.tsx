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
import { Checkbox } from "@/components/ui/checkbox";
type Props = {
	initialData: Chapter;
	chapterId: string;
	courseId: string;
};
const formSchema = z.object({
	isFree: z.boolean().default(false),
});
const ChapterAccessForm = ({ initialData, chapterId, courseId }: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: Boolean(initialData.isFree), // make sure its a boolean value if its undefined
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
				Chapter Access
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing ? (
						<>cancel</>
					) : (
						<>
							<BiPencil className="h-4 w-4 mr-2" />
							Edit access
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
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this field to make this chapter free for preview
										</FormDescription>
									</div>
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
						!initialData.isFree && "text-slate-700 italic"
					)}
				>
					{initialData.isFree ? (
						<p>Free For Preview</p>
					) : (
						<p>Not Free For Preview</p>
					)}
				</div>
			)}
		</div>
	);
};

export default ChapterAccessForm;
