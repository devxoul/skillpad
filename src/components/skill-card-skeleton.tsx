import { Skeleton } from '@/ui/skeleton'

export function SkillCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[18px] w-28" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Skeleton className="h-3 w-3 shrink-0 rounded" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="h-7 w-7 shrink-0" />
    </div>
  )
}
