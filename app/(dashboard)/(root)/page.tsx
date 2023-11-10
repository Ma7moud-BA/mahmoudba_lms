import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "../search/_components/courses-list";
import { AiOutlineClockCircle } from "react-icons/ai";
import InfoCard from "./_components/info-card";
import { GrCompliance } from "react-icons/gr";
export default async function Dashboard() {
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const { completedCourses, coursesInProgress } = await getDashboardCourses(
		userId
	);
	return (
		<div className="p-6 space-y-4">
			<div className="grid grid-cols-4 sm:grid-cols-2 gap-4">
				<InfoCard
					icon={AiOutlineClockCircle}
					label="In Progress"
					numberOfItems={coursesInProgress.length}
				/>
				<InfoCard
					icon={GrCompliance}
					label="Completed"
					variant="success"
					numberOfItems={completedCourses.length}
				/>
			</div>
			<CoursesList items={[...coursesInProgress, ...completedCourses]} />
		</div>
	);
}
