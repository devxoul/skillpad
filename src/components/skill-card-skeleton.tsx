import { Skeleton } from '@/ui/skeleton'

export function SkillCardSkeleton() {
  return (
    <div className="rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-4 w-10 rounded-full" />
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
