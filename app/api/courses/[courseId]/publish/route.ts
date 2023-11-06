import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params;
		const { userId } = auth();
		//isPublished is going to be handled is a separate route after check all the requirements fields for the chapter to be published
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const course = await db.course.findUnique({
			where: { id: courseId, userId: userId },
			include: { chapters: { include: { muxData: true } } },
		});
		if (!course) {
			return new NextResponse("Not Found", { status: 401 });
		}
		const hasPublishedChapters = course.chapters.some(
			(chapter) => chapter.isPublished
		);

		if (
			!course.title ||
			!course.description ||
			!course.imageUrl ||
			!course.price ||
			!course.categoryId ||
			!hasPublishedChapters
		) {
			return new NextResponse("Missing required fields", { status: 400 });
		}
		const publishedCourse = await db.course.update({
			where: {
				id: courseId,
			},
			data: {
				isPublished: true,
			},
		});
		return NextResponse.json(publishedCourse);
	} catch (error) {
		console.log("[COURSE_PUBLISH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
