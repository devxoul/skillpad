export function SkillDetailSkeleton() {
  return (
    <div className="px-5 py-4 space-y-3">
      <div className="h-8 w-48 animate-shimmer rounded-lg bg-foreground/[0.04]" aria-hidden="true" />
      <div className="h-32 animate-shimmer rounded-lg bg-foreground/[0.04]" aria-hidden="true" />
    </div>
  )
}
