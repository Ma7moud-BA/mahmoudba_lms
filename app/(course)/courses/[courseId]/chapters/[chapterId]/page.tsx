import getChapter from "@/actions/get-chapter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiAlertTriangle } from "react-icons/fi";
import VideoPlayer from "./_components/video-player";

const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	const { courseId, chapterId } = params;
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const {
		course,
		chapter,
		attachments,
		muxData,
		purchase,
		userProgress,
		nextChapter,
	} = await getChapter({ userId, chapterId, courseId });

	if (!chapter || !course) {
		return redirect("/");
	}
	const isLocked = !chapter.isFree && !purchase;
	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<div>
					(
					<Alert className="bg-yellow-200 rounded-none">
						<AiOutlineCheckCircle className="h-4 w-4" />
						<AlertDescription>
							You already completed this chapter
						</AlertDescription>
					</Alert>
					)
				</div>
			)}
			{isLocked && (
				<div>
					<Alert className="bg-yellow-200 rounded-none">
						<FiAlertTriangle className="h-4 w-4" />
						<AlertDescription>
							You need to purchase this course to watch this chapter.
						</AlertDescription>
					</Alert>
				</div>
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<VideoPlayer
					chapterId={chapterId}
					title={chapter.title}
					courseId={courseId}
					nextChapterId={nextChapter?.id!}
					playbackId={muxData?.playbackId!}
					isLocked={isLocked}
					completeOnEnd={completeOnEnd}
				/>
			</div>
		</div>
	);
};

export default ChapterIdPage;
