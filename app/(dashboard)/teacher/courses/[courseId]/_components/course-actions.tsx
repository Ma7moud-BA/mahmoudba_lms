"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";

type Props = {
	disabled: boolean;
	isPublished: boolean;
	courseId: string;
};
const CourseActions = ({ courseId, disabled, isPublished }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleOnClick = async () => {
		try {
			setIsLoading(true);
			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);
				toast.success("Course UnPublished");
				router.refresh();
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);
				toast.success("Course Published");
				router.refresh();
			}
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	};
	const handleOnDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}`);
			toast.success("Course Deleted");
			router.push(`/teacher/courses`);
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={handleOnClick}
				disabled={disabled || isLoading}
				variant={"outline"}
				size={"sm"}
			>
				{isPublished ? "UnPublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={handleOnDelete}>
				<Button size={"sm"} disabled={isLoading}>
					<BsTrash size={15} />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default CourseActions;
