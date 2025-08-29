export function LaunchSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      <div className="p-5 space-y-3">
        <div>
          <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-white/10 rounded-full w-20"></div>
        </div>
        <div className="h-12 bg-white/10 rounded"></div>
      </div>
    </div>
  );
}
