"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BiImage, BiPencil, BiPlusCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
type Props = {
	initialData: Course;
};
const formSchema = z.object({
	imageUrl: z.string().min(1, { message: "Image Is Required" }),
});
const ImageForm = ({ initialData }: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const router = useRouter();
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${initialData.id}`, values);
			toast.success("Course title Updated");
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing && <>cancel</>}{" "}
					{!isEditing && !initialData.imageUrl && (
						<>
							<BiPlusCircle className="h-4 w-4 mr-2" />
							Add an image
						</>
					)}
					{!isEditing && initialData.imageUrl && (
						<>
							<BiPencil className="h-4 w-4 mr-2" />
							Edit image
						</>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="courseImage"
						onChange={(url) => {
							if (url) {
								onSubmit({ imageUrl: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16/9 aspect ration recommended
					</div>
				</div>
			) : !initialData.imageUrl ? (
				<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
					<BiImage size={50} />
				</div>
			) : (
				<div className="relative aspect-video mt-2">
					<Image
						alt="upload"
						fill
						className="object-cover rounded-md"
						src={initialData.imageUrl}
					/>
				</div>
			)}
		</div>
	);
};

export default ImageForm;
