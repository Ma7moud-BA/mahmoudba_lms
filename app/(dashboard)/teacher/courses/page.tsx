import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherPage = async () => {
	const { userId } = auth();
	if (!userId) {
		return redirect("/");
	}
	const courses = await db.course.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="p-6">
			<DataTable columns={columns} data={courses} />
		</div>
	);
};

export default TeacherPage;
