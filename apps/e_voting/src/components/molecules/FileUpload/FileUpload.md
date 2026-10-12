# FileUpload

A file input molecule styled like the `Input` atom. It displays the selected
file name in a read-only field and shows a clear (X) button on the right when
a file is present.

## Anatomy

- Hidden native `file` input element (single file only)
- Read-only `Input` atom showing the file name or placeholder text
- Clear (X) button rendered only when a file has been selected

## Props

| Prop          | Type                          | Default            | Description                                      |
| ------------- | ----------------------------- | ------------------ | ------------------------------------------------ |
| `onChange`    | `(file: File \| null) => void` | `(file) => {}`    | Callback when a file is selected or cleared.     |
| `accept`      | `string`                      | `undefined`        | HTML `accept` attribute for file filtering.      |
| `disabled`    | `boolean`                     | `false`            | Disables the input and hides the clear button.    |
| `placeholder` | `string`                      | `"Pilih file..."`  | Placeholder text when no file is selected.        |
| `inputRef`    | `Ref<HTMLInputElement>`       | `undefined`        | Ref forwarded to the hidden file input element.  |

## Usage

```tsx
import FileUpload from "@/components/molecules/FileUpload";

const handleFileChange = (file: File | null) => {
  if (file) console.log(file.name);
};

<FileUpload
  accept=".xlsx,.xls,.csv"
  placeholder="Pilih file Excel"
  onChange={handleFileChange}
/>;
```
