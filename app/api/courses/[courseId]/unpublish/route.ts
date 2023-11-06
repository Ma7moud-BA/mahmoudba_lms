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
		});
		if (!course) {
			return new NextResponse("Not Found", { status: 401 });
		}

		const unPublishedCourse = await db.course.update({
			where: {
				id: courseId,
			},
			data: {
				isPublished: false,
			},
		});

		return NextResponse.json(unPublishedCourse);
	} catch (error) {
		console.log("[COURSE_UNPUBLISH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
