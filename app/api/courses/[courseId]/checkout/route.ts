import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params;
		const user = await currentUser();
		if (!user || !user.id || !user.emailAddresses?.[0].emailAddress) {
			return new NextResponse("UnAuthorized", { status: 401 });
		}

		const course = await db.course.findUnique({
			where: { id: courseId, isPublished: true },
		});

		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId: user.id,
					courseId,
				},
			},
		});
		if (purchase) {
			return new NextResponse("Course Already Purchased", { status: 400 });
		}
		if (!course) {
			return new NextResponse("Course Not Found", { status: 404 });
		}

		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				quantity: 1,
				price_data: {
					currency: "USD",
					product_data: {
						name: course.title,
						description: course.description!,
					},
					unit_amount: Math.round(course.price! * 100),
				},
			},
		];
		let stripeCustomer = await db.stripeCustomer.findUnique({
			where: { userId: user.id },
			select: {
				stripeCustomerId: true,
			},
		});
		if (!stripeCustomer) {
			const customer = await stripe.customers.create({
				email: user.emailAddresses[0].emailAddress,
			});
			stripeCustomer = await db.stripeCustomer.create({
				data: {
					userId: user.id,
					stripeCustomerId: customer.id,
				},
			});
		}
		//what happens when we call this route, we are not creating a purchase here, we are creating a customer because we don't know when the payment will succeed,because they have to do the payment in real world,
		// so the user have to authenticate with their bank that they are doing an online purchase, so we don't exactly know when that is going to happen so we add a metadata, so when the purchase goes throw and the
		// user authorizes it, the stripe is going to throw us back a web hook using this metadata and then using this metadata in the webhook we are going to know which payment just went through by knowing which user
		// is buying and which course is he buying
		const session = await stripe.checkout.sessions.create({
			customer: stripeCustomer.stripeCustomerId,
			line_items,
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
			metadata: {
				courseId: courseId,
				userId: user.id,
			},
		});
		return NextResponse.json({ url: session.url });
	} catch (error: any) {
		console.log("COURSE_CHECKOUT", error.message);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
