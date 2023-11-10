import getChapter from "@/actions/get-chapter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AiFillFile, AiOutlineCheckCircle } from "react-icons/ai";
import { FiAlertTriangle } from "react-icons/fi";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseProgressButton from "./_components/course-progress-button";

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
					<Alert className="bg-yellow-200 rounded-none">
						<AiOutlineCheckCircle className="h-4 w-4" />
						<AlertDescription>
							You already completed this chapter
						</AlertDescription>
					</Alert>
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
				<div className="p-4">
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
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						{purchase ? (
							<CourseProgressButton
								chapterId={chapterId}
								courseId={courseId}
								nextChapterId={nextChapter?.id}
								isCompleted={!!userProgress?.isCompleted}
							/>
						) : (
							<CourseEnrollButton courseId={courseId} price={course.price!} />
						)}
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map((attachment) => (
									<a
										href={attachment.url}
										key={attachment.id}
										target="_blank"
										className=" flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
									>
										<AiFillFile />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
