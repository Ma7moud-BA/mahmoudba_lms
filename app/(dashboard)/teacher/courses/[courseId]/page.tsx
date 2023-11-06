import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoriesForm from "./_components/categories-form";
import { BsListCheck } from "react-icons/bs";
import { AiFillFile, AiOutlineDollar } from "react-icons/ai";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachement-form";
import ChaptersForm from "./_components/chapters-form";
import { LuLayoutDashboard } from "react-icons/lu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FiAlertTriangle } from "react-icons/fi";
import CourseActions from "./_components/course-actions";
type Props = {
	params: { courseId: string };
};
const CoursePage = async ({ params }: Props) => {
	const { courseId } = params;
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const course = await db.course.findUnique({
		where: { id: courseId, userId },
		include: {
			attachments: { orderBy: { createdAt: "desc" } },
			chapters: { orderBy: { position: "asc" } },
		},
	});
	const categories = await db.category.findMany({ orderBy: { name: "asc" } });
	if (!course) {
		return redirect("/");
	}
	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];
	const totalFields = requiredFields.length;
	//this will get all the fields that does'nt equal to false
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const isComplete = requiredFields.every(Boolean);
	return (
		<>
			{!course.isPublished && (
				<Alert className="bg-yellow-200 rounded-none">
					<FiAlertTriangle className="h-4 w-4" />

					<AlertDescription>
						This course is unpublished, It won&apos;t be visible to the
						students.
					</AlertDescription>
				</Alert>
			)}
			<div className="p-6">
				<div className=" flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">Course setup</h1>
						<span className="text-sm text-slate-700">
							Complete all fields {completionText}
						</span>
					</div>
					<CourseActions
						courseId={courseId}
						disabled={!isComplete}
						isPublished={course.isPublished}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LuLayoutDashboard} />
							<h2 className="text-xl">Customize your course</h2>
						</div>
						<TitleForm initialData={course} />
						<DescriptionForm initialData={course} />
						<ImageForm initialData={course} />
						<CategoriesForm
							initialData={course}
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
						/>
					</div>
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={BsListCheck} />

								<h2> Course chapters</h2>
							</div>
							<ChaptersForm initialData={course} />
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={AiOutlineDollar} />
								<h2 className="text-xl">Sell your course</h2>
							</div>
							<PriceForm initialData={course} />
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={AiFillFile} />
								<h2 className="text-xl">Resources & Attachments</h2>
							</div>
							<AttachmentForm initialData={course} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CoursePage;
