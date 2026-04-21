export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[1.5rem] border border-white/60 bg-[linear-gradient(135deg,rgba(226,232,240,0.82),rgba(241,245,249,0.96),rgba(226,232,240,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${className}`}
    />
  );
}
