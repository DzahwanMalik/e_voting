# FileUpload

A file input molecule styled like the `Input` atom. It displays the selected
file name in a read-only field and shows a clear (X) button on the right when
a file is present.

Has built-in client-side validation for file size and type.

## Anatomy

- Hidden native `file` input element (single file only)
- Read-only `Input` atom showing the file name or placeholder text
- Clear (X) button rendered only when a file has been selected
- Validation: rejects files exceeding `maxSize` or not matching `accept` types

## Props

| Prop          | Type                          | Default            | Description                                     |
| ------------- | ----------------------------- | ------------------ | ----------------------------------------------- |
| `onChange`    | `(file: File \| null) => void` | `(file) => {}`    | Callback when a file is selected or cleared.    |
| `accept`      | `string`                      | `undefined`        | HTML `accept` attribute for file filtering.     |
| `disabled`    | `boolean`                     | `false`            | Disables the input.                            |
| `placeholder` | `string`                      | `"Pilih file..."`  | Placeholder text when no file is selected.      |
| `inputRef`    | `Ref<HTMLInputElement>`       | `undefined`        | Ref forwarded to the hidden file input element. |
| `maxSize`     | `number`                      | `undefined`        | Max file size in bytes. Files exceeding this are rejected. |
| `onError`     | `(error: string) => void`     | `undefined`        | Called when a file is rejected (type or size validation failure). |

## File Validation

When the optional `maxSize` prop is provided, the component validates files
client-side before accepting them:

- **Size validation**: Rejects files larger than `maxSize` bytes
- **Type validation**: Checks `file.type` and extension against the `accept` pattern
  - Supports wildcard MIME patterns (`image/*`), exact MIME types (`image/jpeg`), and extensions (`.pdf`)
- On validation failure:
  - Sets an error state (`border-destructive`, `AlertCircle` icon)
  - Calls `onError(errorMessage)` callback
  - Does **not** pass the rejected file to `onChange`
- Error messages are displayed inline using the `AlertCircle` icon

### Size Formatting

Sizes are displayed using a `formatBytes` helper: `B`, `KB`, or `MB`.

## Usage

```tsx
import FileUpload from "@/components/molecules/FileUpload";

const handleFileChange = (file: File | null) => {
  if (file) console.log(file.name);
};

<FileUpload
  accept="image/jpeg,image/png,image/gif,image/webp"
  placeholder="Pilih foto..."
  maxSize={5 * 1024 * 1024} // 5 MB
  onError={(message) => console.error(message)}
  onChange={handleFileChange}
/>;
```
