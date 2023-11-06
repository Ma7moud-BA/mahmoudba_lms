"use client";
import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";

// this library is forked from beautiful react-dnd
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { BiGridVertical, BiPencil } from "react-icons/bi";
import { BsGripVertical } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
type Props = {
	onEdit: (id: string) => void;
	onReorder: (updateData: { id: string; position: number }[]) => void;
	items: Chapter[];
};
const ChaptersList = ({ items, onEdit, onReorder }: Props) => {
	const [isMounted, setIsMounted] = useState<Boolean>(false);
	const [chapters, setChapters] = useState(items);
	useEffect(() => {
		// when you have the use client directive this doesn't mean that the server-side rendering is completely skipped, and that can cause a hydration error if what rendered on the server side doesn't match what is rendered on the client side
		setIsMounted(true);
	}, []);
	useEffect(() => {
		setChapters(items);
	}, [items]);
	if (!isMounted) {
		// this means that this entire component is going to be displayed only on the client side rendering
		// this whole issue exists because the drag and drop components is not optimized for the server side
		return null;
	}
	const handleOnDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const items = Array.from(chapters);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);
		const startIndex = Math.min(result.source.index, result.destination.index);
		const endIndex = Math.max(result.source.index, result.destination.index);
		const updatedChapters = items.slice(startIndex, endIndex + 1);
		setChapters(items);
		const bulkUpdatedData = updatedChapters.map((chapter) => {
			return {
				id: chapter.id,
				position: items.findIndex((item) => item.id === chapter.id),
			};
		});
		onReorder(bulkUpdatedData);
	};
	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								key={chapter.id}
								draggableId={chapter.id}
								index={index}
							>
								{(provided) => (
									<div
										className={cn(
											"flex text-sm items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4",
											chapter.isPublished && "bg-sky-100 border-sky-200"
										)}
										ref={provided.innerRef}
										{...provided.draggableProps}
									>
										<div
											className={cn(
												"px-2 py-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
												chapter.isPublished && "border-sky-200 hover:bg-sky-200"
											)}
											{...provided.dragHandleProps}
										>
											<BsGripVertical size={20} />
										</div>
										{chapter.title}
										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{chapter.isFree && <Badge>Free</Badge>}
											<Badge
												className={cn(
													"bg-slate-500",
													chapter.isPublished && "bg-sky-700"
												)}
											>
												{chapter.isPublished ? "Published" : "Draft"}
											</Badge>
											<BiPencil
												onClick={() => {
													onEdit(chapter.id);
												}}
												size={20}
												cursor="pointer"
												className="hover:opacity-75 transition-all"
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default ChaptersList;
