import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
	AiFillBackward,
	AiOutlineEye,
	AiOutlineVideoCamera,
	AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import ChapterTitleForm from "./_components/Chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const { courseId, chapterId } = params;
	const chapter = await db.chapter.findUnique({
		where: { id: chapterId, courseId: courseId },
		include: { muxData: true },
	});

	if (!chapter) {
		return redirect("/");
	}

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;

	return (
		<div className=" p-6">
			<div className="flex items-center justify-between">
				<div className="w-full">
					<Link
						href={`/teacher/courses/${courseId}`}
						className="flex items-center text-sm hover:opacity-75 transition mb-6"
					>
						<BiArrowBack className="mr-2" />
						Back to course setup
					</Link>
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-y-2">
							<h1 className="text-2xl font-medium">Chapter creation</h1>
							<span className="text-sm text-slate-700">
								Complete all fields {completionText}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LuLayoutDashboard} />
							<h2 className="text-xl"> Customize your chapter</h2>
						</div>
						<ChapterTitleForm
							initialData={chapter}
							courseId={courseId}
							chapterId={chapterId}
						/>
						<ChapterDescriptionForm
							initialData={chapter}
							chapterId={chapterId}
							courseId={courseId}
						/>
					</div>
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={AiOutlineEye} />
							<h2 className="text-xl"> Access Settings</h2>
						</div>
						<ChapterAccessForm
							initialData={chapter}
							chapterId={chapterId}
							courseId={courseId}
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={AiOutlineVideoCamera} />
						<h2 className="text-xl">Add a video</h2>
					</div>
					<ChapterVideoForm
						initialData={chapter}
						chapterId={chapterId}
						courseId={courseId}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
