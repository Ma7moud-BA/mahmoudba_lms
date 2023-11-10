"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsXCircle } from "react-icons/bs";

type Props = {
	chapterId: string;
	courseId: string;
	nextChapterId?: string;
	isCompleted?: boolean;
};

const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId,
}: Props) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const Icon = isCompleted ? BsXCircle : AiOutlineCheckCircle;

	const handleOnClick = async () => {
		try {
			setIsLoading(true);
			await axios.put(
				`/api/courses/${courseId}/chapters/${chapterId}/progress`,
				{ isCompleted: !isCompleted }
			);
			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
				toast.success("Progress updated");
				router.refresh();
			}

			if (!isCompleted && !nextChapterId) {
				router.push("/");
				toast.success("Course Completed");
				router.refresh();
			}
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		//the success variant is a custom made
		<Button
			type="button"
			variant={isCompleted ? "outline" : "success"}
			onClick={handleOnClick}
			disabled={isLoading}
		>
			{isCompleted ? "Mark as incomplete" : "Mark as complete"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};

export default CourseProgressButton;
