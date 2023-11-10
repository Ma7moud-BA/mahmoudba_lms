import { IconBadge } from "@/components/icon-badge";
import { IconType } from "react-icons";

type Props = {
	icon: IconType;
	label: string;
	variant?: "default" | "success";
	numberOfItems: number | null;
};
const InfoCard = ({ icon: Icon, label, numberOfItems, variant }: Props) => {
	return (
		<div className="border rounded-md flex items-center gap-x-2 p-3">
			<IconBadge icon={Icon} variant={variant} />
			<div>
				<p className=" font-medium">{label}</p>
				<p className="text-gray-500 text-sm">
					{numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
				</p>
			</div>
		</div>
	);
};

export default InfoCard;
