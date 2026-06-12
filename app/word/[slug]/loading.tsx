export default function WordLoading() {
  return (
    <div className="flex flex-col flex-1">
      <header className="w-full py-6 px-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="w-full max-w-xl mx-auto">
          <div className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
      </header>
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
          <div className="h-6 w-64 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </main>
    </div>
  );
}
