import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const ko = {
  // common
  common_download: '다운로드',
  common_github: 'GitHub',
  common_footer_rights: '모든 권리를 보유합니다.',

  // home - hero
  home_hero_title: 'AI 에이전트 스킬을 한눈에 둘러보고, 설치하고, 관리하세요',
  home_hero_description:
    'SkillPad는 skills.sh용 데스크톱 앱입니다. 갤러리에서 스킬을 둘러보고, 원하는 에이전트에 원클릭으로 설치하고, 전역 스킬과 프로젝트별 스킬을 한곳에서 관리하세요.',
  home_hero_whats_agent_skills: '에이전트 스킬이란?',

  // home - features
  home_feature_gallery_title: '갤러리 둘러보기',
  home_feature_gallery_description: 'skills.sh 갤러리에서 새로운 스킬을 찾아보세요.',
  home_feature_install_title: '원클릭 설치',
  home_feature_install_description: '터미널 없이 원하는 에이전트에 설치하세요.',
  home_feature_scope_title: '전역/프로젝트별 관리',
  home_feature_scope_description: '전역 스킬과 프로젝트별 스킬을 나란히 관리하세요.',
  home_feature_updates_title: '자동 업데이트',
  home_feature_updates_description: '앱 안에서 새 버전을 바로 확인하세요.',

  // home - what is agent skills
  home_whats_title: '에이전트 스킬이란?',
  home_whats_description_1:
    '에이전트 스킬은 AI 코딩 에이전트에 전문 지식을 더해주는 마크다운 파일입니다. AI용 플러그인처럼, 설치하면 에이전트가 새로운 작업을 바로 수행할 수 있습니다.',
  home_whats_plugins_label: 'AI용 플러그인',
  home_whats_description_2:
    '예를 들어 스킬 하나로 에이전트가 더 나은 React 컴포넌트를 작성하고, 팀 코딩 규칙을 따르고, 브라우저 작업을 자동화하고, Slack 워크스페이스를 관리할 수 있습니다.',
  home_whats_markdown_title: '그냥 마크다운',
  home_whats_markdown_description: '각 스킬은 에이전트가 실행 중에 읽는 SKILL.md 파일입니다.',
  home_whats_agents_title: '어떤 에이전트와도 호환',
  home_whats_agents_description: 'Claude Code, Cursor, Windsurf 등. 오픈 표준인 skills.sh를 따릅니다.',
  home_whats_scope_title: '전역 또는 프로젝트별 설치',
  home_whats_scope_description: '모든 프로젝트에 스킬을 전역으로 설치하거나, 특정 프로젝트에만 적용할 수 있습니다.',
  home_whats_community_title: '커뮤니티 기반',
  home_whats_community_description: 'skills.sh에서 수백 개의 스킬을 둘러보고, 직접 만들어 공유하세요.',

  // home - badge
  home_badge_title: 'SkillPad 설치 배지',
  home_badge_description: 'README에 이 배지를 넣으면 원클릭 설치 링크를 제공할 수 있습니다.',
  home_badge_try: '예시:',
  home_badge_clear: '지우기',

  // home - cta
  home_cta_title: 'SkillPad 다운로드',
  home_cta_description: '무료 오픈소스. macOS, Windows 지원.',

  // download
  download_title: 'SkillPad 다운로드',
  download_description: '무료 오픈소스. macOS, Windows 지원.',
  download_version: '버전 {tag} \u00b7 {date} 출시',
  download_error: '릴리스 정보를 불러올 수 없습니다.',
  download_error_cta: 'GitHub에서 릴리스 보기',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 이상',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 이상 (64비트)',
  download_recommended: '추천',
  download_not_available: '사용 불가',
  download_all_releases: 'GitHub에서 모든 릴리스 보기',

  // install
  install_opening: 'SkillPad 여는 중...',
  install_opening_description: '앱에서 {skillId} 스킬을 여는 중입니다.',
  install_not_installed: 'SkillPad가 설치되어 있지 않습니다',
  install_not_installed_description: 'SkillPad로 AI 에이전트 스킬을 더 쉽게 둘러보고 설치할 수 있습니다.',
  install_skill_id: '스킬 ID',
  install_download: 'SkillPad 다운로드',
  install_try_again: '다시 시도',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
