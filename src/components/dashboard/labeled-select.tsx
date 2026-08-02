import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Base UI's <Select.Value> renders the raw value by default — unlike Radix, it does NOT
 * auto-derive the label from the matching <Select.Item>'s children. This wrapper always
 * supplies the lookup render-function so the trigger shows the human label, not the id.
 */
export function LabeledSelect({
  value,
  onChange,
  options,
  placeholder,
  emptyMessage = "Nothing available.",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}) {
  const lookup = Object.fromEntries(options.map((o) => [o.value, o.label]));

  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder}>{(v: string) => lookup[v] ?? v}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
