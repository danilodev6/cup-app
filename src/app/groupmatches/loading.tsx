export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
      <div className="flex gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
      </div>
      <p className="text-xs uppercase tracking-widest text-gray-400">
        Loading matches
      </p>
    </div>
  );
}
