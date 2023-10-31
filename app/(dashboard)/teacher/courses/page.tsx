import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

const TeacherPage = async () => {
	const courses = await db.course.findMany();
	return (
		<div>
			<Link href="/teacher/create">
				<Button>New Course</Button>
			</Link>
			<div>
				{courses.map((course) => (
					<div key={course.id}>
						{" "}
						<Link href={`/teacher/courses/${course.id}`}>{course.id}</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default TeacherPage;
