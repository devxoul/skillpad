import type { Metadata } from 'next'
import { InstallRedirectPage } from './install-page'

interface PageProps {
  params: Promise<{
    id: string[]
  }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const skillId = params.id.map(decodeURIComponent).join('/')
  const skillName = params.id[params.id.length - 1] ? decodeURIComponent(params.id[params.id.length - 1]) : 'skill'

  return {
    title: `Install ${skillName}`,
    description: `Install the "${skillId}" skill into SkillPad. Browse and manage AI agent skills with a visual desktop interface.`,
    robots: {
      index: false,
    },
    openGraph: {
      title: `Install ${skillName} — SkillPad`,
      description: `Install the "${skillId}" skill into SkillPad with one click.`,
      url: `/install/${skillId}`,
    },
  }
}

export default function Page() {
  return <InstallRedirectPage />
}
