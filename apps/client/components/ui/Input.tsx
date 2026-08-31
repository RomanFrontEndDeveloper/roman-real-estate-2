type InputProps = {
  placeholder?: string;
  type?: string;
};

export default function Input({
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary"
    />
  );
}