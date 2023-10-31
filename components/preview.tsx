"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

type Props = {
	value: string;
};
export const Preview = ({ value }: Props) => {
	// importing ReactQuill without the server side rendering
	const ReactQuill = useMemo(
		() => dynamic(() => import("react-quill"), { ssr: false }),
		[]
	);

	return (
		<div>
			<ReactQuill theme="bubble" value={value} readOnly></ReactQuill>
		</div>
	);
};
