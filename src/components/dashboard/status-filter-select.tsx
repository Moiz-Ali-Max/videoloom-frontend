import { LabeledSelect } from "./labeled-select";

const OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export function StatusFilterSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <LabeledSelect value={value} onChange={onChange} options={OPTIONS} className="w-40" />;
}
