# ImportVotersModal

A modal organism for importing voters from an Excel (or CSV) file into a
specific election. This replaces **all** existing voter assignments for the
election with the rows from the uploaded file.

## Anatomy

- `Modal` molecule wrapper
- Descriptive text explaining required columns and the replacement behaviour
- `FileUpload` molecule for file selection (`.xlsx`, `.xls`, `.csv`; max 5 MB)
- Footer with **Batal** (cancel) and **Konfirmasi Impor** (confirm) buttons

## Props

| Prop            | Type                        | Required | Description                                        |
| --------------- | --------------------------- | -------- | -------------------------------------------------- |
| `electionId`    | `number`                    | yes      | The election to import voters into.                |
| `electionTitle` | `string`                    | no       | Optional title displayed in the description.       |
| `isOpen`        | `boolean`                   | yes      | Controls modal visibility.                         |
| `onClose`       | `() => void`                | yes      | Called when the user clicks Batal or the close X.  |
| `onImportSuccess` | `() => void`              | no       | Called after a successful import to refresh data.  |

## Behaviour

1. User optionally clicks **Unduh Template** to download a pre-formatted Excel
   template with the required columns (`username`, `name`, `password`) and two
   sample rows.
2. User selects a `.xlsx`, `.xls`, or `.csv` file via the `FileUpload` molecule.
3. User clicks **Konfirmasi Impor**.
4. The file is sent to `POST /api/elections/:id/voters/import`.
5. On success, a toast is shown with created/updated counts and the modal closes.
6. On failure, a toast shows the error message.

## Usage

```tsx
import ImportVotersModal from "@/components/organisms/ImportVotersModal";

const [isImportOpen, setImportOpen] = useState(false);

<ImportVotersModal
  electionId={election.id}
  electionTitle={election.title}
  isOpen={isImportOpen}
  onClose={() => setImportOpen(false)}
  onImportSuccess={() => refetch()}
/>;
```
