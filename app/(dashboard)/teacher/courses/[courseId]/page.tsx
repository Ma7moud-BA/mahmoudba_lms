import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LucideLayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
type Props = {
	params: { courseId: string };
};
const CoursePage = async ({ params }: Props) => {
	const { courseId } = params;
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const course = await db.course.findUnique({ where: { id: courseId } });
	if (!course) {
		return redirect("/");
	}
	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
	];
	const totalFields = requiredFields.length;
	//this will get all the fields that does'nt equal to false
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	return (
		<div className="p-6">
			<div className=" flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-medium">Course setup</h1>
					<span className="text-sm text-slate-700">
						Complete all fields {completionText}
					</span>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LucideLayoutDashboard} />
						<h2 className="text-xl">Customize your course</h2>
					</div>
					<TitleForm initialData={course} />
					<DescriptionForm initialData={course} />
				</div>
			</div>
		</div>
	);
};

export default CoursePage;
