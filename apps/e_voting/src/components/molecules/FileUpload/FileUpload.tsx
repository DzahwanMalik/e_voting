import { useState, useRef, type ChangeEvent, type MouseEvent } from "react";
import { X } from "lucide-react";
import Input from "@/components/atoms/Input";
import type { FileUploadProps } from "./FileUpload.types";

const FileUpload = ({
  onChange,
  accept,
  disabled = false,
  placeholder = "Pilih file...",
  inputRef,
  className = "",
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const internalRef = useRef<HTMLInputElement>(null);
  const fileInputRef = inputRef ?? internalRef;

  const resolveRef = (): HTMLInputElement | null => {
    if (!fileInputRef) return null;
    if ("current" in fileInputRef) {
      return fileInputRef.current as HTMLInputElement | null;
    }
    return null;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    onChange?.(null);
    const input = resolveRef();
    if (input) {
      input.value = "";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    const input = resolveRef();
    if (input) {
      input.click();
    }
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleClear();
  };

  const rightElement = selectedFile ? (
    <button
      type="button"
      onClick={handleRemove}
      className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded transition-colors"
      aria-label="Hapus file"
    >
      <X className="w-4 h-4" />
    </button>
  ) : null;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
      />
      <Input
        type="text"
        value={selectedFile?.name ?? ""}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={handleClick}
        rightElement={rightElement}
        className={`cursor-${disabled ? "default" : "pointer"} ${className}`}
      />
    </>
  );
};

export default FileUpload;
