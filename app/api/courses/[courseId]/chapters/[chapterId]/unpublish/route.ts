import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { courseId, chapterId } = params;
		const { userId } = auth();
		//isPublished is going to be handled is a separate route after check all the requirements fields for the chapter to be published
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const courseOwner = await db.course.findUnique({
			where: { id: courseId, userId: userId },
		});
		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const unPublishedChapter = await db.chapter.update({
			where: {
				courseId: courseId,
				id: chapterId,
			},
			data: {
				isPublished: false,
			},
		});
		// in case this is the only chapter remaining published in the course and we deleted it unpublish the entire course
		const publishedChaptersInCourse = await db.chapter.findMany({
			where: { courseId: courseId, isPublished: true },
		});
		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}
		return NextResponse.json(unPublishedChapter);
	} catch (error) {
		console.log("[CHAPTER_UNPUBLISH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
