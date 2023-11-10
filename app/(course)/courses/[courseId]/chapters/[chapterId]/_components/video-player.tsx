"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { AiOutlineLock } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { cn } from "@/lib/utils";

type Props = {
	chapterId: string;
	title: string;
	courseId: string;
	nextChapterId: string;
	playbackId: string;
	isLocked: boolean;
	completeOnEnd: boolean;
};
const VideoPlayer = ({
	chapterId,
	completeOnEnd,
	courseId,
	isLocked,
	nextChapterId,
	playbackId,
	title,
}: Props) => {
	const [isReady, setIsReady] = useState<boolean>(false);
	const router = useRouter();
	const handleOnVideoEnd = async () => {
		try {
			if (completeOnEnd) {
				await axios.put(
					`/api/courses/${courseId}/chapters/${chapterId}/progress`,
					{ isCompleted: true }
				);
			}
			toast.success("Progress updated");
			router.refresh();
			if (nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
				router.refresh();
			}
			if (!nextChapterId) {
				toast.success("Course Finished");
				router.refresh();
			}
		} catch (error) {
			toast.error("Something Went Wrong");
		}
	};
	return (
		<div className="relative aspect-video">
			{" "}
			{!isReady && !isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<FiLoader className="h-8 w-8 animate-spin text-secondary" />
				</div>
			)}
			{isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
					<AiOutlineLock className="h-8 w-8 text-secondary" />
					<p className="text-sm">This chapter is locked</p>
				</div>
			)}
			{!isLocked && (
				<MuxPlayer
					title={title}
					className={cn(!isReady && "hidden")}
					onCanPlay={() => {
						setIsReady(true);
					}}
					onEnded={handleOnVideoEnd}
					autoPlay
					playbackId={playbackId}
				/>
			)}
		</div>
	);
};

export default VideoPlayer;
