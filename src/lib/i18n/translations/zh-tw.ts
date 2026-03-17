import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const zhTW = {
  // agent-checkbox-list
  agent_list_show_fewer: '顯示較少',
  agent_list_show_more: '再顯示 {count} 項',

  // add-skill-dialog
  add_skill_agents: '代理',
  add_skill_button: '新增',
  add_skill_button_loading: '新增中...',
  add_skill_cancel: '取消',
  add_skill_error_fallback: '新增技能失敗',
  add_skill_error_global: '全域: {message}',
  add_skill_error_partial: '已新增至 {successCount} 個目標，但以下失敗：{errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: '全域',
  add_skill_install_to: '安裝至',
  add_skill_loading_projects: '載入專案中...',
  add_skill_success: '技能已新增至 {count} 個目標！',
  add_skill_title: '新增 {name}',

  // batch-add-skill-dialog
  batch_add_button: '新增',
  batch_add_button_loading: '新增中... ({progress})',
  batch_add_cancel: '取消',
  batch_add_error_fallback: '新增技能失敗',
  batch_add_error_global: '全域/{source}: {message}',
  batch_add_error_partial: '已完成 {successCount} 項安裝，但有 {errorCount} 項失敗：{errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: '全域',
  batch_add_install_to: '安裝至',
  batch_add_loading_projects: '載入專案中...',
  batch_add_success: '已將 {skillCount} 項技能新增至 {targetCount} 個目標！',
  batch_add_title_one: '新增 {count} 項技能',
  batch_add_title_other: '新增 {count} 項技能',
  batch_agents: '代理',

  // command-palette
  command_palette_actions: '操作',
  command_palette_check_for_update: '檢查更新',
  command_palette_empty: '找不到結果。',
  command_palette_navigation: '導覽',
  command_palette_placeholder: '搜尋...',
  command_palette_preferences: '偏好設定',
  command_palette_skills: '技能',

  // common
  common_cancel: '取消',
  common_global: '全域',

  // error-boundary
  error_boundary_message: '發生未預期的錯誤',
  error_boundary_reload: '重新載入應用程式',
  error_boundary_title: '發生問題',

  // gallery-view
  gallery_no_repo_skills: '此儲存庫中找不到技能',
  gallery_no_skills: '沒有可用的技能',
  gallery_no_skills_match: '沒有符合搜尋條件的技能',
  gallery_refresh: '重新整理',
  gallery_repo_section: '{repo} 中的技能',
  gallery_search_placeholder: '搜尋技能...',
  gallery_select_mode_exit: '退出選取模式',
  gallery_select_mode_start: '選取技能',
  gallery_subtitle: '瀏覽並探索可用的技能',
  gallery_title: '技能目錄',

  // inline-error
  inline_error_retry: '重試',
  inline_error_title: '錯誤',

  // installed-skills-view
  installed_add_from_directory: '從技能目錄新增技能到此專案',
  installed_all_up_to_date: '全部都是最新版本',
  installed_check_errors_count: '有 {count} 項無法檢查',
  installed_check_errors_title: '檢查更新失敗',
  installed_check_for_updates: '檢查更新',
  installed_failed_to_remove: '移除失敗：{names}',
  installed_failed_to_remove_skill: '移除技能失敗',
  installed_no_skills: '尚未安裝任何技能',
  installed_no_skills_match: '沒有符合搜尋條件的技能',
  installed_project_skills: '專案技能',
  installed_refresh: '重新整理',
  installed_remove_selected: '移除所選項目',
  installed_search_placeholder: '搜尋技能...',
  installed_select_mode_exit: '退出選取模式',
  installed_select_mode_start: '選取技能',
  installed_skill_count: '已安裝 {count} 項技能',
  installed_skill_count_label: '{count} 項技能',
  installed_title: '全域技能',
  installed_update_all: '全部更新 ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: '自動隱藏',
  preferences_agents_description: '新增技能時會預先選取。點擊眼睛圖示即可隱藏。',
  preferences_agents_hide: '隱藏 {name}',
  preferences_agents_hide_all: '全部隱藏',
  preferences_agents_show: '顯示 {name}',
  preferences_agents_show_all: '全部顯示',
  preferences_agents_title: '預設代理',
  preferences_auto_update_check: '啟用自動更新檢查',
  preferences_auto_update_description: '啟動時檢查是否有新版本',
  preferences_auto_update_title: '自動更新',
  preferences_cancel: '取消',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: '語言',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: '新增技能時使用的套件執行工具',
  preferences_package_manager_label: '套件管理器',
  preferences_package_manager_title: '套件管理器',
  preferences_save: '儲存',
  preferences_title: '偏好設定',

  // search-input
  search_clear: '清除搜尋',
  search_placeholder: '搜尋...',

  // selection-action-bar
  selection_action_add: '新增所選項目',
  selection_count: '已選取 {count} 項技能',
  selection_deselect: '取消選取',
  selection_select_all: '全選',

  // sidebar
  sidebar_click_to_confirm: '點擊以確認',
  sidebar_fallback_notice: '找不到 {from} - 改用 {to}',
  sidebar_global_skills: '全域技能',
  sidebar_import_project: '匯入專案',
  sidebar_loading: '載入中...',
  sidebar_no_projects: '沒有專案',
  sidebar_preferences: '偏好設定',
  sidebar_projects: '專案',
  sidebar_remove: '移除',
  sidebar_remove_project: '移除專案',
  sidebar_skills_directory: '技能目錄',

  // skill-card
  skill_card_add: '新增技能',
  skill_card_checking: '檢查中...',
  skill_card_click_to_confirm: '點擊以確認',
  skill_card_error: '錯誤',
  skill_card_remove: '移除',
  skill_card_remove_skill: '移除技能',
  skill_card_select: '選取 {name}',
  skill_card_update: '更新',
  skill_card_updating: '更新中...',

  // skill-detail-view
  detail_about: '關於',
  detail_add: '新增',
  detail_error_description: '此技能可能屬於多技能儲存庫的一部分，因此無法自動定位內容。',
  detail_error_title: '無法載入技能內容',
  detail_from_source: '來自 {source}',
  detail_go_back: '返回',
  detail_installed: '已安裝',
  detail_installed_locally: '已安裝到本機',
  detail_installs: '{count} 次安裝',
  detail_not_found: '找不到技能「{id}」',
  detail_not_found_title: '找不到技能',
  detail_view_on_github: '在 GitHub 上查看',
  detail_view_source: '查看原始碼',

  // update-banner
  update_banner_available: '可使用 v{version}',
  update_banner_download: '下載',
  update_banner_downloading: '下載更新中...',
  update_banner_error: '錯誤：{message}',
  update_banner_ready: '已準備好更新',
  update_banner_restart: '重新啟動',
  update_banner_retry: '重試',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
