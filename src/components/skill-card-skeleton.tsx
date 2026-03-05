import { Skeleton } from '@/ui/skeleton'

export function SkillCardSkeleton() {
  return (
    <div className="rounded-lg px-3 py-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-2 h-2.5 w-48" />
    </div>
  )
}
