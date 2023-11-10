import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { courseId, chapterId } = params;
		const { userId } = auth();
		const { isCompleted } = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		//upsert method will Create or update one UserProgress.
		const userProgress = await db.userProgress.upsert({
			where: {
				userId_chapterId: {
					userId,
					chapterId: chapterId,
				},
			},
			update: {
				isCompleted: isCompleted,
			},
			create: {
				userId,
				chapterId: chapterId,
				isCompleted: isCompleted,
			},
		});
		return NextResponse.json(userProgress);
	} catch (error) {
		console.log("[CHAPTER_ID_PROGRESS]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
