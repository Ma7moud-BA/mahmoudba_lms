import NavBarRoutes from "@/components/layout/navbar/NavBarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { AiOutlineMenu } from "react-icons/ai";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import CourseSidebar from "./course-sidebar";

type Props = {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
};
const CourseMobileSidebar = ({ course, progressCount }: Props) => {
	return (
		<div className="md:hidden pr-4 hover:opacity-75 transition">
			<Sheet>
				<SheetTrigger asChild>
					<AiOutlineMenu cursor="pointer" />
				</SheetTrigger>
				<SheetContent side="left" className="p-0 bg-white w-72">
					<CourseSidebar course={course} progressCount={progressCount} />
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default CourseMobileSidebar;
