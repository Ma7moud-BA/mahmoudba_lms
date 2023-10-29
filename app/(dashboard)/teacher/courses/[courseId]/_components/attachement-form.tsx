"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BiImage, BiPencil, BiPlusCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import {
	AiFillDelete,
	AiFillFile,
	AiOutlineLoading3Quarters,
} from "react-icons/ai";
type Props = {
	initialData: Course & { attachments: Attachment[] };
};
const formSchema = z.object({
	url: z.string().min(1),
});
const AttachmentForm = ({ initialData }: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const router = useRouter();
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${initialData.id}/attachments`, values);
			toast.success("Course title Updated");
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	const handleOnDelete = async (id: string) => {
		try {
			setDeletingId(id);
			await axios.delete(`/api/courses/${initialData.id}/attachments/${id}`);
			toast.success("Attachment Deleted");
			router.refresh();
		} catch (error: any) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course attachment
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing && <>cancel</>}{" "}
					{!isEditing && (
						<>
							<BiPlusCircle className="h-4 w-4 mr-2" />
							Add a file
						</>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onChange={(url) => {
							if (url) {
								onSubmit({ url: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add anything your students might need to complete the course
					</div>
				</div>
			) : (
				<>
					{initialData.attachments.length === 0 ? (
						<p className="text-sm mt-2 text-slate-500 italic">No attachments</p>
					) : (
						<div className="space-y-0">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex items-center p-3 w-full border-sky-200 border text-sky-700 rounded-md bg-sky-100"
								>
									<AiFillFile className="h-4 w-4 mr-2 flex-shrink-0" />
									<p className="text-xs line-clamp-1"> {attachment.name}</p>
									{deletingId === attachment.id ? (
										<AiOutlineLoading3Quarters className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
									) : (
										<AiFillDelete
											onClick={() => {
												handleOnDelete(attachment.id);
											}}
											className="h-4 w-4 mr-2 flex-shrink-0 cursor-pointer"
										/>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AttachmentForm;
