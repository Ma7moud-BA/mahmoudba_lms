import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();
		const { courseId } = params;
		const values = await req.json();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const course = await db.course.update({
			where: { id: courseId, userId },
			data: { ...values },
		});
		return NextResponse.json(course);
	} catch (error: any) {
		console.log("[CourseIdPatch]", error.message);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
