import { Skeleton } from '@/ui/skeleton'

export function SkillDetailSkeleton() {
  return (
    <div className="px-5 py-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>
      <div className="mb-8">
        <Skeleton className="mb-3 h-3 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
