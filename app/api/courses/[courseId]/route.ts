import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import Mux from "@mux/mux-node";
import { isTeacher } from "@/actions/teacher";

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);
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

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId } = params;
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const course = await db.course.findUnique({
			where: { id: courseId, userId },
			include: { chapters: { include: { muxData: true } } },
		});

		if (!course) {
			return new NextResponse("Not found", { status: 404 });
		}
		//the muxData in the database will automatically be deleted but this is for deleting the asset from mux
		for (const chapter of course.chapters) {
			if (chapter.muxData?.assetId) {
				await Video.Assets.del(chapter.muxData?.assetId);
			}
		}
		const deletedCourse = await db.course.delete({
			where: { id: courseId, userId },
		});
		return NextResponse.json(deletedCourse);
	} catch (error: any) {
		console.log("[CourseIdDELETE]", error.message);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
