import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const zhCN = {
  // common
  common_download: '下载',
  common_github: 'GitHub',
  common_footer_rights: 'All rights reserved.',

  // home - hero
  home_hero_title: '可视化浏览、安装和管理 AI 代理技能',
  home_hero_description:
    'SkillPad 是 skills.sh 的桌面 GUI。从画廊浏览技能，一键安装到任意代理，在同一处管理全局和项目范围的技能。',
  home_hero_whats_agent_skills: '什么是代理技能？',

  // home - features
  home_feature_gallery_title: '画廊浏览',
  home_feature_gallery_description: '直接从 skills.sh 画廊发现新技能。',
  home_feature_install_title: '一键安装',
  home_feature_install_description: '无需使用终端即可安装到您偏好的代理。',
  home_feature_scope_title: '灵活范围',
  home_feature_scope_description: '并排管理全局和项目范围的技能。',
  home_feature_updates_title: '自动更新',
  home_feature_updates_description: '内置更新检查，随时保持最新版本。',

  // home - what is agent skills
  home_whats_title: '什么是代理技能？',
  home_whats_description_1:
    '代理技能是为 AI 编程代理提供其原本不具备的专业知识的 Markdown 文件。可以将其视为 AI 的插件 — 安装一个技能，您的代理就能立即掌握新能力。',
  home_whats_plugins_label: 'AI 的插件',
  home_whats_description_2:
    '例如，技能可以教您的代理编写更好的 React 组件、遵循团队的编码规范、自动化浏览器任务或管理您的 Slack 工作区。',
  home_whats_markdown_title: '纯 Markdown',
  home_whats_markdown_description: '每个技能都是一个 SKILL.md 文件，包含代理在运行时读取的专注、结构化的指令。',
  home_whats_agents_title: '适用于任何代理',
  home_whats_agents_description: 'Claude Code、Cursor、Windsurf 等。技能使用开放的 skills.sh 标准。',
  home_whats_scope_title: '全局或项目范围',
  home_whats_scope_description: '将技能全局安装到所有项目，或限定在特定项目中。',
  home_whats_community_title: '社区驱动',
  home_whats_community_description: '在 skills.sh 上浏览数百个技能，或创建自己的技能与他人分享。',

  // home - badge
  home_badge_title: 'Available on SkillPad 徽章',
  home_badge_description: '在 README 中嵌入此徽章，实现一键安装。',
  home_badge_try: '试试:',
  home_badge_clear: '清除',

  // home - cta
  home_cta_title: '下载 SkillPad',
  home_cta_description: '免费开源。支持 macOS 和 Windows。',

  // download
  download_title: '下载 SkillPad',
  download_description: '支持 macOS 和 Windows。免费开源。',
  download_version: '版本 {tag} \u00b7 发布于 {date}',
  download_error: '无法加载发布信息。',
  download_error_cta: '在 GitHub 上查看发布',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 或更高版本',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 或更高版本（64位）',
  download_recommended: '推荐',
  download_not_available: '不可用',
  download_all_releases: '在 GitHub 上查看所有发布',

  // install
  install_opening: '正在打开 SkillPad...',
  install_opening_description: '正在尝试在应用中打开 {skillId}。',
  install_not_installed: 'SkillPad 尚未安装',
  install_not_installed_description: 'SkillPad 让您通过可视化界面浏览和安装 AI 代理技能。',
  install_skill_id: '技能 ID',
  install_download: '下载 SkillPad',
  install_try_again: '重试',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
