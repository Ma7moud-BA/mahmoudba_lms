"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

type Props = {
	onChange: (value: string) => void;
	value: string;
};
export const Editor = ({ onChange, value }: Props) => {
	// importing ReactQuill without the server side rendering
	const ReactQuill = useMemo(
		() => dynamic(() => import("react-quill"), { ssr: false }),
		[]
	);

	return (
		<div className="bg-white">
			<ReactQuill theme="snow" value={value} onChange={onChange}></ReactQuill>
		</div>
	);
};
