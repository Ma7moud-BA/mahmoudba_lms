import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { courseId } = params;

	const course = await db.course.findUnique({
		where: { id: courseId },
		include: {
			chapters: {
				where: { isPublished: true },
				orderBy: { position: "asc" },
			},
		},
	});
	if (!course) {
		return redirect("/");
	}
	return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
