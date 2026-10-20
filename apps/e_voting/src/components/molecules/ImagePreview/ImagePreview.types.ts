import type { ImgHTMLAttributes } from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  onError?: () => void;
}

export type { ImagePreviewProps };
