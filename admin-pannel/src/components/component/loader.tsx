export function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="space-y-6">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-muted shadow-lg h-30 w-full animate-spin border-black" />
          <div className="absolute inset-0 rounded-full bg-muted shadow-lg z-10 h-29 animate-spin border-black border-dashed border-2" />
        </div>
        <div className="text-2xl font-bold text-primary animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}
