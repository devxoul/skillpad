import { Skeleton } from '@/ui/skeleton'

export function InstalledSkillItemSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[18px] w-24" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 shrink-0 rounded" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
      </div>
      <div className="h-4 w-4 shrink-0" />
    </div>
  )
}
