"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
	courseId: string;
	price: number;
};
const CourseEnrollButton = ({ courseId, price }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleOnClick = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(`/api/courses/${courseId}/checkout`);
			window.location.assign(response.data.url);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Button size={"sm"} disabled={isLoading} onClick={handleOnClick}>
			{" "}
			Enroll for {formatPrice(price)}
		</Button>
	);
};

export default CourseEnrollButton;
