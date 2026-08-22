import * as React from "react";
import "./ImageUploader.css"
type ImageUploaderProps = {
    placeholder?: string
    onUpload: (file: File) => void;
    imagePath: string | null | undefined;
}


const ImageUploader = ({placeholder, onUpload, imagePath} : ImageUploaderProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onUpload(file);
    };

    return (
        <label className="ImageUploader">
            <input
                type="file"
                hidden
                onChange={handleChange}
            />

            <img className={imagePath ? "ImageUploaderWithUserImage" : "ImageUploaderEmpty"} src={imagePath ?? "/favicon.svg"} alt="" />
            {!imagePath && <span>{placeholder ? placeholder : "Выберите изображение"}</span>}
        </label>
    )

}
export default ImageUploader