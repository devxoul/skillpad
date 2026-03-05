import { Skeleton } from '@/ui/skeleton'

export function SkillDetailSkeleton() {
  return (
    <div className="px-5 py-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-3 h-8 w-48 rounded-lg" />
      <div className="mt-8 space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}
