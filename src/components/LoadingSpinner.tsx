export default function LoadingSpinner({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f0dfe9] border-t-[#d4537e]" />
      <p className="text-sm text-[#7d5d86]">{label}</p>
    </div>
  );
}
