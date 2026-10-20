interface ImageUploadValue {
  file: File | null;
  removed: boolean;
}

interface ImageUploadProps {
  id: string;
  label: string;
  value: ImageUploadValue;
  onChange: (value: ImageUploadValue) => void;
  existingUrl?: string | null;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  optional?: boolean;
  hint?: string;
  className?: string;
  onError?: (message: string) => void;
}

export type { ImageUploadValue, ImageUploadProps };
