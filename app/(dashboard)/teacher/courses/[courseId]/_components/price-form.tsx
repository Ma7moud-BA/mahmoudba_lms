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
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format-price";
type Props = {
	initialData: Course;
};
const formSchema = z.object({
	price: z.coerce.number(),
});
const PriceForm = ({ initialData }: Props) => {
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: initialData.price || undefined, // Convert null to an empty string
		},
	});

	const { isSubmitting, isValid } = form.formState;
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
				Course price
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing ? (
						<>cancel</>
					) : (
						<>
							<BiPencil className="h-4 w-4 mr-2" />
							Edit price
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
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											step={1.0}
											disabled={isSubmitting}
											placeholder="Set a price for your course"
											{...field}
										></Input>
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
				<p
					className={cn(
						"text-sm ml-2",
						!initialData.price && "text-slate-700 italic"
					)}
				>
					{initialData.price
						? formatPrice(initialData.price)
						: "No price is set"}
				</p>
			)}
		</div>
	);
};

export default PriceForm;
