import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const zhCN = {
  // agent-checkbox-list
  agent_list_show_fewer: '收起',
  agent_list_show_more: '再显示 {count} 项',

  // add-skill-dialog
  add_skill_agents: '代理',
  add_skill_button: '添加',
  add_skill_button_loading: '添加中...',
  add_skill_cancel: '取消',
  add_skill_error_fallback: '添加技能失败',
  add_skill_error_global: '全局: {message}',
  add_skill_error_partial: '已添加到 {successCount} 个目标，但以下失败: {errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: '全局',
  add_skill_install_to: '安装到',
  add_skill_loading_projects: '正在加载项目...',
  add_skill_success: '已将技能添加到 {count} 个目标！',
  add_skill_title: '添加 {name}',

  // batch-add-skill-dialog
  batch_add_button: '添加',
  batch_add_button_loading: '添加中... ({progress})',
  batch_add_cancel: '取消',
  batch_add_error_fallback: '添加技能失败',
  batch_add_error_global: '全局/{source}: {message}',
  batch_add_error_partial: '已完成 {successCount} 项安装，但有 {errorCount} 项失败: {errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: '全局',
  batch_add_install_to: '安装到',
  batch_add_loading_projects: '正在加载项目...',
  batch_add_success: '已将 {skillCount} 个技能添加到 {targetCount} 个目标！',
  batch_add_title_one: '添加 {count} 个技能',
  batch_add_title_other: '添加 {count} 个技能',
  batch_agents: '代理',

  // command-palette
  command_palette_actions: '操作',
  command_palette_check_for_update: '检查更新',
  command_palette_empty: '未找到结果。',
  command_palette_navigation: '导航',
  command_palette_placeholder: '搜索...',
  command_palette_preferences: '偏好设置',
  command_palette_skills: '技能',

  // common
  common_cancel: '取消',
  common_global: '全局',

  // error-boundary
  error_boundary_message: '发生了意外错误',
  error_boundary_reload: '重新加载应用',
  error_boundary_title: '出现问题',

  // gallery-view
  gallery_no_repo_skills: '此仓库中未找到技能',
  gallery_no_skills: '没有可用的技能',
  gallery_no_skills_match: '没有匹配搜索的技能',
  gallery_refresh: '刷新',
  gallery_repo_section: '{repo} 中的技能',
  gallery_search_placeholder: '搜索技能...',
  gallery_select_mode_exit: '退出选择模式',
  gallery_select_mode_start: '选择技能',
  gallery_subtitle: '浏览并发现可用的技能',
  gallery_title: '技能目录',

  // inline-error
  inline_error_retry: '重试',
  inline_error_title: '错误',

  // installed-skills-view
  installed_add_from_directory: '从技能目录将技能添加到此项目',
  installed_all_up_to_date: '全部为最新版本',
  installed_check_errors_count: '有 {count} 项无法检查',
  installed_check_errors_title: '检查更新失败',
  installed_check_for_updates: '检查更新',
  installed_failed_to_remove: '移除失败: {names}',
  installed_failed_to_remove_skill: '移除技能失败',
  installed_no_skills: '未安装任何技能',
  installed_no_skills_match: '没有匹配搜索的技能',
  installed_project_skills: '项目技能',
  installed_refresh: '刷新',
  installed_remove_selected: '移除所选',
  installed_search_placeholder: '搜索技能...',
  installed_select_mode_exit: '退出选择模式',
  installed_select_mode_start: '选择技能',
  installed_skill_count: '已安装 {count} 个技能',
  installed_skill_count_label: '{count} 个技能',
  installed_title: '全局技能',
  installed_update_all: '全部更新 ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: '自动隐藏',
  preferences_agents_description: '添加技能时会默认选中。点击眼睛图标可隐藏。',
  preferences_agents_hide: '隐藏 {name}',
  preferences_agents_hide_all: '全部隐藏',
  preferences_agents_show: '显示 {name}',
  preferences_agents_show_all: '全部显示',
  preferences_agents_title: '默认代理',
  preferences_auto_update_check: '启用自动检查更新',
  preferences_auto_update_description: '启动时检查新版本',
  preferences_auto_update_title: '自动更新',
  preferences_cancel: '取消',
  preferences_check_for_update: '检查更新',
  preferences_up_to_date: '已是最新版本',
  preferences_update_available: 'v{version} 可用',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: '语言',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: '添加技能时使用的包运行工具',
  preferences_package_manager_label: '包管理器',
  preferences_package_manager_title: '包管理器',
  preferences_save: '保存',
  preferences_section_agents: '代理',
  preferences_section_general: '通用',
  preferences_title: '偏好设置',

  // search-input
  search_clear: '清除搜索',
  search_placeholder: '搜索...',

  // selection-action-bar
  selection_action_add: '添加所选',
  selection_count_one: '已选择 {count} 个技能',
  selection_count_other: '已选择 {count} 个技能',
  selection_deselect: '取消选择',
  selection_select_all: '全选',

  // sidebar
  sidebar_click_to_confirm: '点击确认',
  sidebar_fallback_notice: '未找到 {from} - 改用 {to}',
  sidebar_global_skills: '全局技能',
  sidebar_import_project: '导入项目',
  sidebar_loading: '加载中...',
  sidebar_no_projects: '没有项目',
  sidebar_preferences: '偏好设置',
  sidebar_projects: '项目',
  sidebar_remove: '移除',
  sidebar_remove_project: '移除项目',
  sidebar_skills_directory: '技能目录',

  // skill-card
  skill_card_add: '添加技能',
  skill_card_checking: '检查中...',
  skill_card_click_to_confirm: '点击确认',
  skill_card_error: '错误',
  skill_card_remove: '移除',
  skill_card_remove_skill: '移除技能',
  skill_card_select: '选择 {name}',
  skill_card_update: '更新',
  skill_card_updating: '更新中...',

  // skill-detail-view
  detail_about: '关于',
  detail_add: '添加',
  detail_error_description: '此技能可能属于一个包含多个技能的仓库，因此无法自动定位内容。',
  detail_error_title: '无法加载技能内容',
  detail_from_source: '来自 {source}',
  detail_go_back: '返回',
  detail_installed: '已安装',
  detail_installed_locally: '已在本地安装',
  detail_installs: '{count} 次安装',
  detail_not_found: '找不到技能 "{id}"',
  detail_not_found_title: '未找到技能',
  detail_view_on_github: '在 GitHub 上查看',
  detail_view_source: '查看源码',

  // update-banner
  update_banner_available: 'v{version} 可用',
  update_banner_download: '下载',
  update_banner_downloading: '正在下载更新...',
  update_banner_error: '错误: {message}',
  update_banner_ready: '可以更新',
  update_banner_restart: '重启',
  update_banner_retry: '重试',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
