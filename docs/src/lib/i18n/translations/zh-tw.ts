import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const zhTW = {
  // common
  common_download: '下載',
  common_github: 'GitHub',
  common_footer_rights: 'All rights reserved.',

  // home - hero
  home_hero_title: '視覺化瀏覽、安裝和管理 AI 代理技能',
  home_hero_description:
    'SkillPad 是 skills.sh 的桌面 GUI。從畫廊瀏覽技能，一鍵安裝到任意代理，在同一處管理全域和專案範圍的技能。',
  home_hero_whats_agent_skills: '什麼是代理技能？',

  // home - features
  home_feature_gallery_title: '畫廊瀏覽',
  home_feature_gallery_description: '直接從 skills.sh 畫廊發現新技能。',
  home_feature_install_title: '一鍵安裝',
  home_feature_install_description: '無需使用終端即可安裝到您偏好的代理。',
  home_feature_scope_title: '靈活範圍',
  home_feature_scope_description: '並排管理全域和專案範圍的技能。',
  home_feature_updates_title: '自動更新',
  home_feature_updates_description: '內建更新檢查，隨時保持最新版本。',

  // home - what is agent skills
  home_whats_title: '什麼是代理技能？',
  home_whats_description_1:
    '代理技能是為 AI 程式編寫代理提供其原本不具備的專業知識的 Markdown 檔案。可以將其視為 AI 的外掛 — 安裝一個技能，您的代理就能立即掌握新能力。',
  home_whats_plugins_label: 'AI 的外掛',
  home_whats_description_2:
    '例如，技能可以教您的代理編寫更好的 React 元件、遵循團隊的程式碼規範、自動化瀏覽器任務或管理您的 Slack 工作區。',
  home_whats_markdown_title: '純 Markdown',
  home_whats_markdown_description:
    '每個技能都是一個 SKILL.md 檔案，包含代理在執行時讀取的專注、結構化的指令。',
  home_whats_agents_title: '適用於任何代理',
  home_whats_agents_description:
    'Claude Code、Cursor、Windsurf 等。技能使用開放的 skills.sh 標準。',
  home_whats_scope_title: '全域或專案範圍',
  home_whats_scope_description:
    '將技能全域安裝到所有專案，或限定在特定專案中。',
  home_whats_community_title: '社群驅動',
  home_whats_community_description:
    '在 skills.sh 上瀏覽數百個技能，或建立自己的技能與他人分享。',

  // home - badge
  home_badge_title: 'Available on SkillPad 徽章',
  home_badge_description: '在 README 中嵌入此徽章，實現一鍵安裝。',
  home_badge_try: '試試:',
  home_badge_clear: '清除',

  // home - cta
  home_cta_title: '下載 SkillPad',
  home_cta_description: '免費開源。支援 macOS 和 Windows。',

  // download
  download_title: '下載 SkillPad',
  download_description: '支援 macOS 和 Windows。免費開源。',
  download_version: '版本 {tag} \u00b7 發佈於 {date}',
  download_error: '無法載入發佈資訊。',
  download_error_cta: '在 GitHub 上查看發佈',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 或更高版本',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 或更高版本（64位元）',
  download_recommended: '推薦',
  download_not_available: '不可用',
  download_all_releases: '在 GitHub 上查看所有發佈',

  // install
  install_opening: '正在開啟 SkillPad...',
  install_opening_description: '正在嘗試在應用程式中開啟 {skillId}。',
  install_not_installed: 'SkillPad 尚未安裝',
  install_not_installed_description:
    'SkillPad 讓您透過視覺化介面瀏覽和安裝 AI 代理技能。',
  install_skill_id: '技能 ID',
  install_download: '下載 SkillPad',
  install_try_again: '重試',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
