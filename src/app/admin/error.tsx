"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-400">Admin Error</h2>
      <p className="text-gray-400 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
