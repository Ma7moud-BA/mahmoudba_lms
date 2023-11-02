import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { courseId, chapterId } = params;
		const { userId } = auth();
		//isPublished is going to be handled is a separate route after check all the requirements fields for the chapter to be published
		const { isPublished, ...values } = await req.json();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const courseOwner = await db.course.findUnique({
			where: { id: courseId, userId: userId },
		});
		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const chapter = await db.chapter.update({
			where: { id: chapterId, courseId: courseId },
			data: { ...values },
		});

		if (values.videoUrl) {
			// this is a clean up process if the user is changing a video
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});
			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);
				await db.muxData.delete({
					where: { id: existingMuxData.id },
				});
			}

			const asset = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: "public",
				test: false,
			});
			await db.muxData.create({
				data: {
					chapterId: chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0]?.id,
				},
			});
		}
		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[COURSES_CHAPTER_ID]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
