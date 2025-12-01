"use client";

import Camera from "@/assets/icons/camera.svg";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import ImagePreview, { ImageFile } from "./image-preview";

interface ImageEditProps {
  className?: string;
  limit?: "on" | "off";
  status?: "Default" | "Hover" | "Filled" | "Error";
  maxCount?: number;
  onFileChange?: (files: File[]) => void;
  showPreview?: boolean;
  previewSize?: "small" | "medium" | "large";
  previewLayout?: "grid" | "horizontal" | "vertical";
}

export default function ImageEdit({
  className,
  limit = "on",
  status = "Default",
  maxCount = 3,
  onFileChange,
  showPreview = true,
  previewSize = "medium",
  previewLayout = "horizontal",
}: ImageEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedFiles = [...imageFiles, ...newFiles].slice(0, maxCount);
    setImageFiles(updatedFiles);
    onFileChange?.(updatedFiles.map((img) => img.file));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    const newFiles = imageFiles.filter((img) => img.id !== id);
    setImageFiles(newFiles);
    onFileChange?.(newFiles.map((img) => img.file));
  };

  const currentStatus = imageFiles.length > 0 ? "Filled" : status;
  const isError = currentStatus === "Error";

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 카메라 박스 */}
      <div
        className={cn(
          "bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group",
          "pb-2.5 pt-2 px-0 border border-transparent",
          currentStatus === "Hover" && "bg-gray-50",
          isError && "",
          className
        )}
        onClick={handleClick}
      >
        <Camera
          className={cn("size-7 transition-colors", {
            "group-hover:[&_path]:fill-[#4F3B2E]": !isError,
            "[&_path]:fill-status-error-500": isError,
          })}
        />

        {limit === "on" && (
          <div
            className={cn(
              "text-caption-s font-medium",
              isError ? "text-status-error-500" : "text-grayscale-gray5"
            )}
          >
            {imageFiles.length}/{maxCount}
          </div>
        )}
      </div>

      {/* 이미지 미리보기 */}
      {showPreview && (
        <ImagePreview
          images={imageFiles}
          onRemove={handleRemoveImage}
          maxImages={maxCount}
          imageSize={previewSize}
          layout={previewLayout}
        />
      )}
    </div>
  );
}
