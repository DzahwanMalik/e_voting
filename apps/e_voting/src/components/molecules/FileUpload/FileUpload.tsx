import { useState, useRef, type ChangeEvent, type MouseEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import Input from "@/components/atoms/Input";
import { validateFile } from "@/lib/utils";
import type { FileUploadProps } from "./FileUpload.types";

const FileUpload = ({
  onChange,
  accept,
  disabled = false,
  placeholder = "Pilih file...",
  inputRef,
  className = "",
  maxSize,
  onError,
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
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
    e.target.value = ""; // reset so the same file can be re-selected

    if (file) {
      const error = validateFile(file, accept, maxSize);
      if (error) {
        setValidationError(error);
        onError?.(error);
        setSelectedFile(null);
        onChange?.(null);
        return;
      }
    }

    setValidationError(null);
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleClear = () => {
    setValidationError(null);
    setSelectedFile(null);
    onChange?.(null);
    const input = resolveRef();
    if (input) {
      input.value = "";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    setValidationError(null);
    const input = resolveRef();
    if (input) {
      input.click();
    }
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleClear();
  };

  const hasError = Boolean(validationError);

  // --- Default: Text-style File Input Mode ---
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
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          value={selectedFile?.name ?? ""}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={handleClick}
          rightElement={rightElement}
          isInvalid={hasError}
          className={`${disabled ? "cursor-default" : "cursor-pointer"} ${className}`.trim()}
        />
        {hasError && (
          <p className="text-xs text-destructive px-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationError}
          </p>
        )}
      </div>
    </>
  );
};

export default FileUpload;
