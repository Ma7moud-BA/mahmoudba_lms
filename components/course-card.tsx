import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BiBookOpen } from "react-icons/bi";
import { formatPrice } from "@/lib/format-price";

type Props = {
	id: string;
	title: string;
	imageUrl: string;
	chaptersLength: number;
	price: number;
	progress: number | null;
	category: string;
};
const CourseCard = ({
	category,
	chaptersLength,
	id,
	imageUrl,
	price,
	progress,
	title,
}: Props) => {
	return (
		<Link href={`/courses/${id}`}>
			<div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
				<div className="relative w-full aspect-video rounded-md overflow-hidden">
					<Image src={imageUrl} fill alt={title}></Image>
				</div>
				<div className="flex flex-col p-2">
					<div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
						{title}
					</div>
					<p className="text-xs text-muted-foreground">{category}</p>
					<div className="my-3 items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<IconBadge size={"sm"} icon={BiBookOpen} />
							<span>
								{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
							</span>
						</div>
					</div>
					{progress !== null ? (
						<div> TODO:Progress Component</div>
					) : (
						<p className="text-md md:text-sm font-medium text-slate-700">
							{formatPrice(price)}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};

export default CourseCard;
