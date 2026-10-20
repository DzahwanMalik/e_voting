import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AlertCircle, ImagePlus, RotateCcw, Trash2, Upload } from "lucide-react";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import ImagePreview from "@/components/molecules/ImagePreview";
import { formatBytes, validateFile } from "@/lib/utils";
import type { ImageUploadProps } from "./ImageUpload.types";

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/gif,image/webp";
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

const ImageUpload = ({
  id,
  label,
  value,
  onChange,
  existingUrl = null,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  optional = false,
  hint,
  className = "",
  onError,
}: ImageUploadProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const objectUrl = useMemo(
    () => (value.file ? URL.createObjectURL(value.file) : null),
    [value.file],
  );

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const previewUrl =
    objectUrl ?? (!value.removed ? (existingUrl ?? null) : null);
  const hasPreview = Boolean(previewUrl);
  const hasExisting = Boolean(existingUrl);
  const isRemoved = value.removed && !value.file;

  const hintText =
    hint ??
    `JPG, PNG, GIF, atau WebP. Maksimal ${formatBytes(maxSize)}.`;

  const statusTitle = value.file
    ? value.file.name
    : isRemoved
      ? "Foto akan dihapus"
      : hasPreview
        ? "Foto saat ini"
        : "Belum ada foto";

  const statusDescription = value.file
    ? `${formatBytes(value.file.size)} - foto baru`
    : isRemoved
      ? "Simpan perubahan untuk menerapkan."
      : hasPreview
        ? "Klik pratinjau untuk melihat ukuran penuh."
        : "Pilih file gambar untuk diunggah.";

  const describedBy = validationError
    ? `${id}-hint ${id}-error`
    : `${id}-hint`;

  const handlePick = (): void => {
    if (disabled) return;
    setValidationError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) return;

    const error = validateFile(file, accept, maxSize);
    if (error) {
      setValidationError(error);
      onError?.(error);
      return;
    }

    setValidationError(null);
    onChange({ file, removed: false });
  };

  const handleRemoveExisting = (): void => {
    setValidationError(null);
    onChange({ file: null, removed: true });
  };

  const handleCancel = (): void => {
    setValidationError(null);
    onChange({ file: null, removed: false });
  };

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        tabIndex={-1}
        aria-invalid={Boolean(validationError)}
        aria-describedby={describedBy}
        className="sr-only"
      />

      <div className="flex items-start gap-3">
        {hasPreview && previewUrl ? (
          <ImagePreview
            src={previewUrl}
            alt={value.file?.name ?? `${label} saat ini`}
            caption={value.file?.name ?? label}
            className="w-24 h-24 shrink-0 rounded-xl border border-border"
            imageClassName="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px] font-medium">Belum ada</span>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {statusTitle}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {statusDescription}
            </p>
          </div>

          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hintText}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={handlePick}
              disabled={disabled}
            >
              {hasPreview ? "Ganti Foto" : "Pilih Foto"}
            </Button>

            {value.file && (
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleCancel}
                disabled={disabled}
              >
                Batalkan
              </Button>
            )}

            {!value.file && isRemoved && hasExisting && (
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleCancel}
                disabled={disabled}
              >
                Batalkan Hapus
              </Button>
            )}

            {!value.file && !isRemoved && hasExisting && (
              <Button
                variant="destructive-ghost"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={handleRemoveExisting}
                disabled={disabled}
              >
                Hapus
              </Button>
            )}
          </div>

          {validationError && (
            <p
              id={`${id}-error`}
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-destructive"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
