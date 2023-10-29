const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();
async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: "Computer Science" },
				{ name: "Music" },
				{ name: "3D" },
				{ name: "Engineering" },
				{ name: "Filming" },
				{ name: "Photography" },
			],
		});
		console.log("categories added successfully");
	} catch (error) {
		console.log("Error seeding the database categories", error);
	} finally {
		await database.$disconnect();
	}
}

main();

/**
 * ! TO UPLOAD THE CATEGORIES TO THE DATABASE RUN THE COMMAND "node scripts/seedCategories.ts "
 */
