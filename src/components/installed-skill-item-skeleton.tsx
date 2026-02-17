import { Skeleton } from '@/ui/skeleton'

export function InstalledSkillItemSkeleton() {
  return (
    <div className="rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-44" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
      </div>
    </div>
  )
}
