"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { BiImage, BiPencil, BiPlusCircle, BiVideo } from "react-icons/bi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
type Props = {
	initialData: Chapter & { muxData?: MuxData | null };
	courseId: string;
	chapterId: string;
};
const formSchema = z.object({
	videoUrl: z.string().min(1),
});
const ChapterVideoForm = ({ initialData, courseId, chapterId }: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const router = useRouter();
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
				Course Video
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing && <>cancel</>}{" "}
					{!isEditing && !initialData.videoUrl && (
						<>
							<BiPlusCircle className="h-4 w-4 mr-2" />
							Add a video
						</>
					)}
					{!isEditing && initialData.videoUrl && (
						<>
							<BiPencil className="h-4 w-4 mr-2" />
							Edit video
						</>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onChange={(url) => {
							if (url) {
								onSubmit({ videoUrl: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						upload this chapter&apos;s video
					</div>
				</div>
			) : !initialData.videoUrl ? (
				<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
					<BiVideo size={50} />
				</div>
			) : (
				<div>
					<div className=" relative aspect-video mt-2">
						<MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
					</div>
					<div className="text-xs text-muted-foreground mt-2">
						Video can take a few minutes to precess. Refresh the page if the
						video does not appear.
					</div>
				</div>
			)}
		</div>
	);
};

export default ChapterVideoForm;
