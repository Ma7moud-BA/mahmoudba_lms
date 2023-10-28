"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";
type Props = {
	onChange: (url?: string) => void;
	endpoint: keyof typeof ourFileRouter;
};

const FileUpload = ({ onChange, endpoint }: Props) => {
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				toast.error(`${error?.message}`);
			}}
		/>
	);
};

export default FileUpload;
