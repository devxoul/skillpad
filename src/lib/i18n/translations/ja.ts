import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const ja = {
  // agent-checkbox-list
  agent_list_show_fewer: '表示を減らす',
  agent_list_show_more: 'あと{count}件表示',

  // add-skill-dialog
  add_skill_agents: 'エージェント',
  add_skill_button: '追加',
  add_skill_button_loading: '追加中...',
  add_skill_cancel: 'キャンセル',
  add_skill_error_fallback: 'スキルを追加できませんでした',
  add_skill_error_global: 'グローバル: {message}',
  add_skill_error_partial: '{successCount}件には追加しましたが、次は失敗しました: {errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: 'グローバル',
  add_skill_install_to: 'インストール先',
  add_skill_loading_projects: 'プロジェクトを読み込み中...',
  add_skill_success: 'スキルを{count}件の対象に追加しました!',
  add_skill_title: '{name}を追加',

  // batch-add-skill-dialog
  batch_add_button: '追加',
  batch_add_button_loading: '追加中... ({progress})',
  batch_add_cancel: 'キャンセル',
  batch_add_error_fallback: 'スキルを追加できませんでした',
  batch_add_error_global: 'グローバル/{source}: {message}',
  batch_add_error_partial: '{successCount}件のインストールは完了しましたが、{errorCount}件は失敗しました: {errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: 'グローバル',
  batch_add_install_to: 'インストール先',
  batch_add_loading_projects: 'プロジェクトを読み込み中...',
  batch_add_success: 'スキル{skillCount}件を{targetCount}件の対象に追加しました!',
  batch_add_title_one: 'スキル{count}件を追加',
  batch_add_title_other: 'スキル{count}件を追加',
  batch_agents: 'エージェント',

  // command-palette
  command_palette_actions: 'アクション',
  command_palette_check_for_update: 'アップデートを確認',
  command_palette_empty: '結果が見つかりませんでした。',
  command_palette_navigation: '移動',
  command_palette_placeholder: '検索...',
  command_palette_preferences: '設定',
  command_palette_skills: 'スキル',

  // common
  common_cancel: 'キャンセル',
  common_global: 'グローバル',

  // error-boundary
  error_boundary_message: '予期しないエラーが発生しました',
  error_boundary_reload: 'アプリを再読み込み',
  error_boundary_title: '問題が発生しました',

  // gallery-view
  gallery_no_repo_skills: 'このリポジトリにはスキルがありません',
  gallery_repo_search_section: 'GitHubで見つかりました',
  gallery_no_skills: '利用できるスキルがありません',
  gallery_no_skills_match: '検索に一致するスキルがありません',
  gallery_refresh: '更新',
  gallery_repo_section: '{repo}のスキル',
  gallery_search_placeholder: 'スキルを検索...',
  gallery_select_mode_exit: '選択モードを終了',
  gallery_select_mode_start: 'スキルを選択',
  gallery_subtitle: '利用できるスキルを探して見つけましょう',
  gallery_title: 'スキルディレクトリ',

  // inline-error
  inline_error_retry: '再試行',
  inline_error_title: 'エラー',

  // installed-skills-view
  installed_add_from_directory: 'スキルディレクトリからこのプロジェクトにスキルを追加',
  installed_all_up_to_date: 'すべて最新です',
  installed_check_errors_count: '{count}件は確認できませんでした',
  installed_check_errors_title: 'アップデートを確認できませんでした',
  installed_check_for_updates: 'アップデートを確認',
  installed_failed_to_remove: '削除に失敗しました: {names}',
  installed_failed_to_remove_skill: 'スキルを削除できませんでした',
  installed_no_skills: 'インストール済みのスキルはありません',
  installed_no_skills_match: '検索に一致するスキルがありません',
  installed_project_skills: 'プロジェクトスキル',
  installed_refresh: '更新',
  installed_remove_selected: '選択した項目を削除',
  installed_search_placeholder: 'スキルを検索...',
  installed_select_mode_exit: '選択モードを終了',
  installed_select_mode_start: 'スキルを選択',
  installed_skill_count: '{count}件のスキルをインストール済み',
  installed_skill_count_label: '{count}件',
  installed_title: 'グローバルスキル',
  installed_update_all: 'すべてアップデート ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: '自動で隠す',
  preferences_agents_description: 'スキル追加時に最初から選択されます。目のアイコンをクリックすると隠せます。',
  preferences_agents_hide: '{name}を隠す',
  preferences_agents_hide_all: 'すべて隠す',
  preferences_agents_show: '{name}を表示',
  preferences_agents_show_all: 'すべて表示',
  preferences_agents_title: 'デフォルトのエージェント',
  preferences_auto_update_check: '自動アップデート確認を有効にする',
  preferences_auto_update_description: '起動時に新しいバージョンを確認します',
  preferences_auto_update_title: '自動アップデート',
  preferences_cancel: 'キャンセル',
  preferences_check_for_update: 'アップデートを確認',
  preferences_up_to_date: '最新の状態です',
  preferences_update_available: 'v{version}が利用可能',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: '言語',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: 'スキル追加時に使うパッケージ実行ツールです',
  preferences_package_manager_label: 'パッケージマネージャー',
  preferences_package_manager_title: 'パッケージマネージャー',
  preferences_save: '保存',
  preferences_section_agents: 'エージェント',
  preferences_section_general: '一般',
  preferences_title: '設定',

  // search-input
  search_clear: '検索をクリア',
  search_placeholder: '検索...',

  // selection-action-bar
  selection_action_add: '選択した項目を追加',
  selection_count_one: '{count}件のスキルを選択中',
  selection_count_other: '{count}件のスキルを選択中',
  selection_deselect: '選択解除',
  selection_select_all: 'すべて選択',

  // sidebar
  sidebar_click_to_confirm: 'クリックして確定',
  sidebar_fallback_notice: '{from}が見つからないため、{to}を使用します',
  sidebar_global_skills: 'グローバルスキル',
  sidebar_import_project: 'プロジェクトを追加',
  sidebar_loading: '読み込み中...',
  sidebar_no_projects: 'プロジェクトがありません',
  sidebar_preferences: '設定',
  sidebar_projects: 'プロジェクト',
  sidebar_remove: '削除',
  sidebar_remove_project: 'プロジェクトを削除',
  sidebar_skills_directory: 'スキルディレクトリ',

  // skill-card
  skill_card_add: 'スキルを追加',
  skill_card_checking: '確認中...',
  skill_card_click_to_confirm: 'クリックして確定',
  skill_card_error: 'エラー',
  skill_card_remove: '削除',
  skill_card_remove_skill: 'スキルを削除',
  skill_card_select: '{name}を選択',
  skill_card_update: 'アップデート',
  skill_card_updating: 'アップデート中...',

  // skill-detail-view
  detail_about: '概要',
  detail_add: '追加',
  detail_error_description:
    'このスキルは複数スキルを含むリポジトリの一部のため、内容を自動で見つけられない場合があります。',
  detail_error_title: 'スキル内容を読み込めませんでした',
  detail_from_source: '{source}から',
  detail_go_back: '戻る',
  detail_installed: 'インストール済み',
  detail_installed_locally: 'ローカルにインストール済み',
  detail_installs: '{count}件のインストール',
  detail_not_found: 'スキル "{id}" が見つかりません',
  detail_not_found_title: 'スキルが見つかりません',
  detail_view_on_github: 'GitHubで見る',
  detail_view_source: 'ソースを見る',

  // update-banner
  update_banner_available: 'v{version}を利用できます',
  update_banner_download: 'ダウンロード',
  update_banner_downloading: 'アップデートをダウンロード中...',
  update_banner_error: 'エラー: {message}',
  update_banner_ready: 'アップデートの準備ができました',
  update_banner_restart: '再起動',
  update_banner_retry: '再試行',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
