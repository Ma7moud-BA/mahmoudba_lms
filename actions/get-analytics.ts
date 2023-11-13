import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";
import { object } from "zod";

type PurchaseWithCourse = Purchase & {
	Course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
	const grouped: { [courseId: string]: number } = {};

	purchases.forEach((purchase) => {
		const courseTitle = purchase.Course.title;
		if (!grouped[courseTitle]) {
			grouped[courseTitle] = 0;
		}
		grouped[courseTitle] += purchase.Course.price!;
	});
	return grouped;
};

export const getAnalytics = async (
	userId: string
): Promise<{
	data: Array<{
		name: string;
		total: number;
	}>;
	totalRevenue: number;
	totalSales: number;
}> => {
	try {
		const purchases = await db.purchase.findMany({
			where: {
				Course: {
					userId: userId,
				},
			},
			include: {
				Course: true,
			},
		});

		const groupedEarnings = groupByCourse(purchases);
		const data = Object.entries(groupedEarnings).map(
			([courseTitle, total]) => ({
				name: courseTitle,
				total: total,
			})
		);

		const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
		const totalSales = purchases.length;
		return {
			data,
			totalRevenue,
			totalSales,
		};
	} catch (error) {
		console.log("GET_ANALYTICS", error);
		return {
			data: [],
			totalRevenue: 0,
			totalSales: 0,
		};
	}
};
