import { isTeacher } from "@/actions/teacher";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const isAuthorized = isTeacher(userId);

		const { title } = await req.json();

		if (!userId || !isAuthorized) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const course = await db.course.create({ data: { userId, title } });
		return new NextResponse(JSON.stringify(course));
	} catch (error) {
		console.log("[Courses]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
