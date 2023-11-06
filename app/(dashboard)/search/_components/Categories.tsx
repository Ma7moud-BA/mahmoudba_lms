"use client";
import { Category } from "@prisma/client";
import React from "react";
import {
	FcEngineering,
	FcFilmReel,
	FcMultipleDevices,
	FcMusic,
	FcOldTimeCamera,
	FcIdea,
} from "react-icons/fc";
import { GrThreeDEffects } from "react-icons/gr";
import { IconType } from "react-icons";
import CategoryItem from "./category-item";
type Props = {
	items: Category[];
};
const iconMap: Record<Category["name"], IconType> = {
	Music: FcMusic,
	Photography: FcOldTimeCamera,
	Filming: FcFilmReel,
	"Computer Science": FcMultipleDevices,
	"3D": FcIdea,
	Engineering: FcEngineering,
};
const Categories = ({ items }: Props) => {
	return (
		<div className="flex items-center gap-x-2 overflow-auto pb-2">
			{items.map((item) => (
				<CategoryItem
					key={item.id}
					label={item.name}
					icon={iconMap[item.name]}
					value={item.id}
				/>
			))}
		</div>
	);
};

export default Categories;
