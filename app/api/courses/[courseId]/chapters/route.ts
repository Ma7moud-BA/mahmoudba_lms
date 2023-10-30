import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	const { courseId } = params;
	const { userId } = auth();
	const { title } = await req.json();
	try {
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const courseOwner = await db.course.findUnique({
			where: { id: courseId, userId: userId },
		});
		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const lastChapter = await db.chapter.findFirst({
			where: { courseId: courseId },
			orderBy: { position: "desc" },
		});
		const newPosition = lastChapter ? lastChapter.position + 1 : 1;
		const newChapter = await db.chapter.create({
			data: {
				title,
				courseId,
				position: newPosition,
			},
		});
		return NextResponse.json(newChapter);
	} catch (error) {
		console.log("[CHAPTERS]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
