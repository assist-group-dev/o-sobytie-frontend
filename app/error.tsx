"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Что-то пошло не так!</h2>
      {error.message && (
        <p className="mt-2 text-sm text-gray-600">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Попробовать снова
      </button>
    </div>
  );
}
