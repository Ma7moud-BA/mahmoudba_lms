import { isTeacher } from "@/actions/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
	const { userId } = auth();

	//making sure only the teacher can access these routes
	if (!isTeacher(userId)) redirect("/");
	return <div>{children}</div>;
};

export default TeacherLayout;
