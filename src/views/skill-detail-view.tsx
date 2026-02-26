import { ArrowLeft, FileText, FolderOpen, GithubLogo, Globe, Plus, SpinnerGap, Warning } from '@phosphor-icons/react'
import { open } from '@tauri-apps/plugin-shell'
import { useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { AddSkillDialog } from '@/components/add-skill-dialog'
import { CodeBlock } from '@/components/code-block'
import { SkillDetailSkeleton } from '@/components/skill-detail-skeleton'
import { useProjects } from '@/contexts/projects-context'
import { useGallerySkills, useSkills } from '@/contexts/skills-context'
import { usePreferences } from '@/hooks/use-preferences'
import { getRepoSkillsCache } from '@/hooks/use-repo-skills'
import { useScrollRestoration } from '@/hooks/use-scroll-restoration'
import { fetchSkillReadme, resolveInstallSource } from '@/lib/api'
import { readLocalSkillMd, type SkillInfo } from '@/lib/cli'
import type { Skill } from '@/types/skill'
import { Skeleton } from '@/ui/skeleton'

function formatInstalls(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return count.toString()
}

function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
  return content.replace(frontmatterRegex, '')
}

function getSourceOrg(source: string | undefined): string {
  if (!source) return 'unknown'
  return source.split('/')[0] || source
}

function isGitHubRepoSource(source: string): boolean {
  return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(source)
}

function installedSkillToSkill(info: SkillInfo): Skill {
  return {
    id: info.name,
    name: info.name,
    installs: 0,
    topSource: '',
  }
}

export function SkillDetailView() {
  const { '*': skillId } = useParams()
  const navigate = useNavigate()
  const { skills: gallerySkills, loading: galleryLoading, fetch: fetchGallery, search } = useGallerySkills()
  const { projects } = useProjects()
  const { installed, fetchInstalledSkills } = useSkills()
  const { preferences } = usePreferences()
  const scrollRef = useScrollRestoration<HTMLDivElement>({ resetOnMount: true })

  const [readme, setReadme] = useState<string | null>(null)
  const [readmeLoading, setReadmeLoading] = useState(false)
  const [readmeError, setReadmeError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [lookedUpSkill, setLookedUpSkill] = useState<Skill | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [resolvedInstallSource, setResolvedInstallSource] = useState<string | null>(null)
  const gallerySkill = gallerySkills.find((s) => s.id === skillId) ?? gallerySkills.find((s) => s.name === skillId)

  const installedSkill = useMemo(() => {
    const allInstalled = Object.values(installed.cache).flatMap((entry) => entry.skills)
    return allInstalled.find((s) => s.name === skillId || skillId?.endsWith('/' + s.name)) ?? null
  }, [installed.cache, skillId])

  const gallerySkillRef = useRef(gallerySkill)
  const installedSkillRef = useRef(installedSkill)
  const lookedUpSkillRef = useRef(lookedUpSkill)
  gallerySkillRef.current = gallerySkill
  installedSkillRef.current = installedSkill
  lookedUpSkillRef.current = lookedUpSkill

  const repoSkill = useMemo(() => {
    if (gallerySkill || installedSkill) return null
    const cache = getRepoSkillsCache()
    for (const [, entry] of cache) {
      const found = entry.skills.find((s) => s.id === skillId) ?? entry.skills.find((s) => s.name === skillId)
      if (found) return found
    }
    return null
  }, [gallerySkill, installedSkill, skillId])

  const skillNames = useMemo(() => {
    if (!repoSkill) return undefined
    const cache = getRepoSkillsCache()
    const entry = cache.get(repoSkill.topSource)
    return entry && entry.skills.length > 1 ? [repoSkill.name] : undefined
  }, [repoSkill])

  const skill =
    gallerySkill ??
    repoSkill ??
    lookedUpSkill ??
    (!lookingUp && installedSkill ? installedSkillToSkill(installedSkill) : null)

  useEffect(() => {
    if (!gallerySkill && !galleryLoading && gallerySkills.length === 0) {
      fetchGallery()
    }
  }, [gallerySkill, galleryLoading, gallerySkills.length, fetchGallery])

  useEffect(() => {
    if (
      gallerySkillRef.current ||
      lookedUpSkillRef.current ||
      !skillId ||
      (installedSkillRef.current && !skillId.includes('/'))
    ) {
      setLookingUp(false)
      return
    }
    const skillName = skillId.split('/').pop() || skillId
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    setLookingUp(true)
    const doSearch = () => {
      if (gallerySkillRef.current || lookedUpSkillRef.current) {
        setLookingUp(false)
        return
      }
      attempts++
      search(skillName)
        .then((results: Skill[]) => {
          if (cancelled || gallerySkillRef.current || lookedUpSkillRef.current) return
          const match = results.find((s: Skill) => s.id === skillId) ?? results.find((s: Skill) => s.name === skillName)
          if (match) setLookedUpSkill(match)
          setLookingUp(false)
        })
        .catch(() => {
          if (cancelled) return
          if (attempts < 3) {
            retryTimer = setTimeout(() => {
              if (!cancelled) doSearch()
            }, 1500)
          } else {
            setLookingUp(false)
          }
        })
    }
    doSearch()
    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [skillId, search])

  useEffect(() => {
    if (!skill?.topSource || !skill?.name) {
      setResolvedInstallSource(null)
      return
    }
    let cancelled = false
    resolveInstallSource(skill.topSource, skill.name)
      .then((source) => {
        if (!cancelled) {
          setResolvedInstallSource(source)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedInstallSource(skill.topSource)
        }
      })
    return () => {
      cancelled = true
    }
  }, [skill?.topSource, skill?.name])

  useEffect(() => {
    if (!skill?.name) return
    if (resolvedInstallSource === null && skill.topSource) return
    setReadmeLoading(true)
    setReadmeError(null)

    const source = resolvedInstallSource || skill.topSource
    const fetchRemote = source ? fetchSkillReadme(source, skill.name) : Promise.reject(new Error('No remote source'))

    fetchRemote
      .catch(() =>
        installedSkill ? readLocalSkillMd(installedSkill.path) : Promise.reject(new Error('Failed to load SKILL.md')),
      )
      .then(setReadme)
      .catch((err) => {
        setReadmeError(err instanceof Error ? err.message : 'Failed to load SKILL.md')
      })
      .finally(() => setReadmeLoading(false))
  }, [resolvedInstallSource, skill?.topSource, skill?.name, installedSkill])

  useEffect(() => {
    fetchInstalledSkills({ global: true })
    for (const project of projects) {
      fetchInstalledSkills({ projectPath: project.path, global: false })
    }
  }, [projects, fetchInstalledSkills])

  const getInstallationStatus = (scope: string) => {
    const cache = installed.cache[scope]
    const isLoading = installed.loadingScope === scope

    if (!cache) {
      return {
        installed: false,
        agents: [],
        loading: isLoading,
      }
    }

    if (!skill) {
      return {
        installed: false,
        agents: [],
        loading: false,
      }
    }

    const installedSkill = cache.skills.find((s) => s.name === skill.name)
    return {
      installed: !!installedSkill,
      agents: installedSkill?.agents || [],
      loading: false,
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const isLoading = !skill && (galleryLoading || gallerySkills.length === 0 || lookingUp)
  const isNotFound = !skill && !isLoading

  return (
    <div className="flex h-full flex-col">
      <header className="-my-1 flex shrink-0 items-center justify-between border-b border-overlay-border-muted px-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-overlay-6 hover:text-foreground/70"
              aria-label="Go back"
            >
              <ArrowLeft size={16} weight="bold" />
            </button>
            <div className="h-4 w-px bg-overlay-8" />
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : isNotFound ? (
              <h1 className="text-[15px] font-semibold text-foreground">Skill Not Found</h1>
            ) : skill ? (
              <h1 className="text-[15px] font-semibold text-foreground">{skill.name}</h1>
            ) : null}
          </div>
          <div className="mt-0.5 h-[18px] text-[12px] text-foreground/40">
            {isLoading ? (
              <Skeleton className="h-2.5 w-20" />
            ) : skill?.topSource ? (
              <>from {getSourceOrg(skill.topSource)}</>
            ) : installedSkill ? (
              <>installed locally</>
            ) : null}
          </div>
        </div>
        {skill && (
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="cursor-pointer rounded-md bg-overlay-8 px-3 py-1.5 text-[12px] font-medium text-foreground transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-overlay-12"
          >
            <div className="flex items-center gap-1.5">
              <Plus size={14} weight="bold" />
              <span>Add</span>
            </div>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="flex-1 overflow-y-auto">
          <SkillDetailSkeleton />
        </div>
      ) : isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <Warning size={32} weight="duotone" className="mx-auto text-foreground/20" />
            <p className="mt-2 text-[13px] text-foreground/40">Could not find skill "{skillId}"</p>
          </div>
        </div>
      ) : skill ? (
        <>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{skill.name}</h2>
                {skill.installs > 0 && (
                  <span className="rounded-full bg-overlay-8 px-2 py-0.5 text-[12px] font-medium text-foreground/50">
                    {formatInstalls(skill.installs)} installs
                  </span>
                )}
              </div>
              {(() => {
                const source = resolvedInstallSource || skill.topSource
                if (!source) {
                  return null
                }
                if (source.startsWith('https://') || source.startsWith('http://')) {
                  return (
                    <button
                      type="button"
                      onClick={() => open(source)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-overlay-3 px-3 py-2 text-[13px] text-foreground/70 transition-colors hover:bg-overlay-6 hover:text-foreground"
                    >
                      <Globe size={16} weight="duotone" />
                      <span>View Source</span>
                    </button>
                  )
                }
                if (isGitHubRepoSource(source)) {
                  return (
                    <button
                      type="button"
                      onClick={() => open(`https://github.com/${source}`)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-overlay-3 px-3 py-2 text-[13px] text-foreground/70 transition-colors hover:bg-overlay-6 hover:text-foreground"
                    >
                      <GithubLogo size={16} weight="fill" />
                      <span>{source}</span>
                    </button>
                  )
                }
                return null
              })()}
            </div>

            {(getInstallationStatus('global').installed ||
              projects.some((p) => getInstallationStatus(p.path).installed)) && (
              <div className="mb-8">
                <h3 className="mb-3 text-[11px] font-medium tracking-wide text-foreground/40 uppercase">Installed</h3>
                <div className="flex flex-wrap gap-2">
                  {getInstallationStatus('global').installed && (
                    <InstallationStatusItem scopeName="Global" isGlobal={true} {...getInstallationStatus('global')} />
                  )}
                  {projects
                    .filter((project) => getInstallationStatus(project.path).installed)
                    .map((project) => (
                      <InstallationStatusItem
                        key={project.id}
                        scopeName={project.name}
                        isGlobal={false}
                        {...getInstallationStatus(project.path)}
                      />
                    ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="mb-3 text-[11px] font-medium tracking-wide text-foreground/40 uppercase">About</h3>
              {readmeLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : readmeError ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-overlay-border bg-overlay-3 py-12 text-center">
                  <FileText size={32} weight="duotone" className="mb-3 text-foreground/40" />
                  <p className="text-[13px] font-medium text-foreground">Couldn't load skill content</p>
                  <p className="mt-1 max-w-[280px] text-[12px] text-foreground/40">
                    This skill may be part of a multi-skill repository where content can't be located automatically.
                  </p>
                  {(() => {
                    const source = resolvedInstallSource || skill.topSource
                    if (!source) {
                      return null
                    }
                    if (source.startsWith('https://') || source.startsWith('http://')) {
                      return (
                        <button
                          type="button"
                          onClick={() => open(source)}
                          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-overlay-6 px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-overlay-8"
                        >
                          <Globe size={14} weight="duotone" />
                          <span>View Source</span>
                        </button>
                      )
                    }
                    if (isGitHubRepoSource(source)) {
                      return (
                        <button
                          type="button"
                          onClick={() => open(`https://github.com/${source}`)}
                          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-overlay-6 px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-overlay-8"
                        >
                          <GithubLogo size={14} weight="fill" />
                          <span>View on GitHub</span>
                        </button>
                      )
                    }
                    return null
                  })()}
                </div>
              ) : readme ? (
                <div className="prose prose-sm max-w-none text-foreground/80 dark:prose-invert prose-headings:text-foreground prose-a:text-brand-600 dark:prose-a:text-emerald-400 prose-strong:text-foreground prose-code:rounded prose-code:bg-overlay-8 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[12px] prose-code:font-normal prose-code:text-foreground/80 prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-overlay-border prose-pre:bg-overlay-4 prose-pre:p-4 prose-pre:text-[12px] prose-pre:leading-relaxed dark:prose-pre:bg-black/[0.4] prose-table:w-full prose-table:border-collapse prose-table:text-[13px] prose-th:border prose-th:border-overlay-border prose-th:bg-overlay-5 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-medium prose-td:border prose-td:border-overlay-border prose-td:px-3 prose-td:py-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre({ children, node }) {
                        const codeChild = node?.children?.[0]
                        if (
                          codeChild?.type === 'element' &&
                          codeChild.tagName === 'code' &&
                          Array.isArray(codeChild.properties?.className) &&
                          codeChild.properties.className.some(
                            (c: unknown) => typeof c === 'string' && c.startsWith('language-'),
                          )
                        ) {
                          return <>{children}</>
                        }
                        return <pre>{children}</pre>
                      },
                      code: CodeBlock,
                    }}
                  >
                    {stripFrontmatter(readme)}
                  </Markdown>
                </div>
              ) : null}
            </div>
          </div>

          <AddSkillDialog
            skill={skill}
            skillNames={skillNames}
            installSource={resolvedInstallSource ?? undefined}
            open={showDialog}
            onOpenChange={setShowDialog}
            defaultAgents={preferences.defaultAgents}
          />
        </>
      ) : null}
    </div>
  )
}

interface InstallationStatusItemProps {
  scopeName: string
  isGlobal: boolean
  installed?: boolean
  agents: string[]
  loading?: boolean
}

function InstallationStatusItem({ scopeName, isGlobal, agents, loading }: InstallationStatusItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-overlay-3 bg-overlay-3 px-3 py-2.5">
      {isGlobal ? (
        <Globe size={18} weight="duotone" className="text-foreground/50" />
      ) : (
        <FolderOpen size={18} weight="duotone" className="text-foreground/50" />
      )}
      <span className="text-[13px] font-medium text-foreground">{scopeName}</span>
      {loading ? (
        <SpinnerGap size={14} className="animate-spin text-foreground/30" />
      ) : (
        agents.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {agents.map((agent) => (
              <span
                key={agent}
                className="flex items-center gap-1 rounded bg-overlay-8 px-1.5 py-0.5 text-[10px] text-foreground/60"
              >
                {agent}
              </span>
            ))}
          </div>
        )
      )}
    </div>
  )
}
