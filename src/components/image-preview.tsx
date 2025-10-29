"use client";

import { cn } from "@/lib/utils";
import PictureRemove from "@/assets/icons/picture-delete.svg";
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  maxImages?: number;
  showRemoveButton?: boolean;
  imageSize?: "small" | "medium" | "large";
  layout?: "grid" | "horizontal" | "vertical";
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  maxImages = 3,
  showRemoveButton = true,
  imageSize = "medium",
  layout = "grid",
}) => {
  if (images.length === 0) return null;

  const getImageSizeClass = () => {
    switch (imageSize) {
      case "small":
        return "w-12 h-12";
      case "large":
        return "w-24 h-24";
      case "medium":
      default:
        return "w-20 h-20";
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex-row flex-nowrap";
      case "vertical":
        return "flex-col items-start";
      case "grid":
      default:
        return "flex-wrap";
    }
  };

  return (
    <div className={cn("flex gap-3", getLayoutClass())}>
      {images.slice(0, maxImages).map((image) => (
        <div key={image.id} className="relative">
          <img
            src={image.preview}
            alt={`preview ${image.id}`}
            className={cn(
              "rounded-lg object-contain bg-white border border-gray-200",
              getImageSizeClass()
            )}
          />
          {showRemoveButton && (
            <button
              onClick={() => onRemove(image.id)}
              className="absolute top-1 right-1   flex "
            >
              <PictureRemove className="group-hover:[&_path]:fill-[#4F3B2E]" />
            </button>
          )}
        </div>
      ))}
      {images.length > maxImages && (
        <div className={cn("relative", getImageSizeClass())}>
          <div
            className={cn(
              "bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium",
              getImageSizeClass()
            )}
          >
            +{images.length - maxImages}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
