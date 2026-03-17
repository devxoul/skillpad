import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const ko = {
  // agent-checkbox-list
  agent_list_show_fewer: '간단히 보기',
  agent_list_show_more: '{count}개 더 보기',

  // add-skill-dialog
  add_skill_agents: '에이전트',
  add_skill_button: '추가',
  add_skill_button_loading: '추가하는 중...',
  add_skill_cancel: '취소',
  add_skill_error_fallback: '스킬을 추가하지 못했습니다',
  add_skill_error_global: '전역: {message}',
  add_skill_error_partial: '{successCount}개 대상에 추가했지만 다음 항목은 실패했습니다: {errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: '전역',
  add_skill_install_to: '설치 대상',
  add_skill_loading_projects: '프로젝트를 불러오는 중...',
  add_skill_success: '스킬을 {count}개 대상에 추가했습니다!',
  add_skill_title: '{name} 추가',

  // batch-add-skill-dialog
  batch_add_button: '추가',
  batch_add_button_loading: '추가하는 중... ({progress})',
  batch_add_cancel: '취소',
  batch_add_error_fallback: '스킬을 추가하지 못했습니다',
  batch_add_error_global: '전역/{source}: {message}',
  batch_add_error_partial: '{successCount}개 설치를 완료했지만 {errorCount}개가 실패했습니다: {errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: '전역',
  batch_add_install_to: '설치 대상',
  batch_add_loading_projects: '프로젝트를 불러오는 중...',
  batch_add_success: '스킬 {skillCount}개를 {targetCount}개 대상에 추가했습니다!',
  batch_add_title_one: '스킬 {count}개 추가',
  batch_add_title_other: '스킬 {count}개 추가',
  batch_agents: '에이전트',

  // command-palette
  command_palette_actions: '동작',
  command_palette_check_for_update: '업데이트 확인',
  command_palette_empty: '검색 결과가 없습니다.',
  command_palette_navigation: '탐색',
  command_palette_placeholder: '검색...',
  command_palette_preferences: '설정',
  command_palette_skills: '스킬',

  // common
  common_cancel: '취소',
  common_global: '전역',

  // error-boundary
  error_boundary_message: '예기치 않은 오류가 발생했습니다',
  error_boundary_reload: '앱 다시 불러오기',
  error_boundary_title: '문제가 발생했습니다',

  // gallery-view
  gallery_no_repo_skills: '이 저장소에서 스킬을 찾을 수 없습니다',
  gallery_no_skills: '사용 가능한 스킬이 없습니다',
  gallery_no_skills_match: '검색과 일치하는 스킬이 없습니다',
  gallery_refresh: '새로고침',
  gallery_repo_section: '{repo}의 스킬',
  gallery_search_placeholder: '스킬 검색...',
  gallery_select_mode_exit: '선택 모드 종료',
  gallery_select_mode_start: '스킬 선택',
  gallery_subtitle: '사용 가능한 스킬을 둘러보고 찾아보세요',
  gallery_title: '스킬 디렉토리',

  // inline-error
  inline_error_retry: '다시 시도',
  inline_error_title: '오류',

  // installed-skills-view
  installed_add_from_directory: '스킬 디렉토리에서 스킬을 추가해 보세요',
  installed_all_up_to_date: '모두 최신 상태입니다',
  installed_check_errors_count: '{count}개는 확인할 수 없었습니다',
  installed_check_errors_title: '업데이트를 확인하지 못했습니다',
  installed_check_for_updates: '업데이트 확인',
  installed_failed_to_remove: '제거하지 못했습니다: {names}',
  installed_failed_to_remove_skill: '스킬을 제거하지 못했습니다',
  installed_no_skills: '설치된 스킬이 없습니다',
  installed_no_skills_match: '검색과 일치하는 스킬이 없습니다',
  installed_project_skills: '프로젝트 스킬',
  installed_refresh: '새로고침',
  installed_remove_selected: '선택 항목 제거',
  installed_search_placeholder: '스킬 검색...',
  installed_select_mode_exit: '선택 모드 종료',
  installed_select_mode_start: '스킬 선택',
  installed_skill_count: '스킬 {count}개 설치됨',
  installed_skill_count_label: '{count}개',
  installed_title: '전역 스킬',
  installed_update_all: '모두 업데이트 ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: '자동 숨김',
  preferences_agents_description: '스킬을 추가할 때 미리 선택됩니다. 눈 아이콘을 눌러 숨길 수 있습니다.',
  preferences_agents_hide: '{name} 숨기기',
  preferences_agents_hide_all: '모두 숨기기',
  preferences_agents_show: '{name} 표시',
  preferences_agents_show_all: '모두 표시',
  preferences_agents_title: '기본 에이전트',
  preferences_auto_update_check: '자동 업데이트 확인 사용',
  preferences_auto_update_description: '실행 시 새 버전을 확인합니다',
  preferences_auto_update_title: '자동 업데이트',
  preferences_cancel: '취소',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: '언어',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: '스킬을 추가할 때 사용할 패키지 실행 도구입니다',
  preferences_package_manager_label: '패키지 매니저',
  preferences_package_manager_title: '패키지 매니저',
  preferences_save: '저장',
  preferences_title: '설정',

  // search-input
  search_clear: '검색 지우기',
  search_placeholder: '검색...',

  // selection-action-bar
  selection_action_add: '선택 항목 추가',
  selection_count_one: '스킬 {count}개 선택됨',
  selection_count_other: '스킬 {count}개 선택됨',
  selection_deselect: '선택 해제',
  selection_select_all: '전체 선택',

  // sidebar
  sidebar_click_to_confirm: '클릭해서 확인',
  sidebar_fallback_notice: '{from}을(를) 찾을 수 없어 {to}을(를) 사용합니다',
  sidebar_global_skills: '전역 스킬',
  sidebar_import_project: '프로젝트 가져오기',
  sidebar_loading: '로딩 중...',
  sidebar_no_projects: '프로젝트가 없습니다',
  sidebar_preferences: '설정',
  sidebar_projects: '프로젝트',
  sidebar_remove: '제거',
  sidebar_remove_project: '프로젝트 제거',
  sidebar_skills_directory: '스킬 디렉토리',

  // skill-card
  skill_card_add: '스킬 추가',
  skill_card_checking: '확인하는 중...',
  skill_card_click_to_confirm: '클릭해서 확인',
  skill_card_error: '오류',
  skill_card_remove: '제거',
  skill_card_remove_skill: '스킬 제거',
  skill_card_select: '{name} 선택',
  skill_card_update: '업데이트',
  skill_card_updating: '업데이트하는 중...',

  // skill-detail-view
  detail_about: '소개',
  detail_add: '추가',
  detail_error_description: '이 스킬은 여러 스킬이 포함된 저장소의 일부여서 내용을 자동으로 찾지 못할 수 있습니다.',
  detail_error_title: '스킬 내용을 불러올 수 없습니다',
  detail_from_source: '제공: {source}',
  detail_go_back: '뒤로 가기',
  detail_installed: '설치됨',
  detail_installed_locally: '로컬에 설치됨',
  detail_installs: '{count} 설치',
  detail_not_found: '"{id}" 스킬을 찾을 수 없습니다',
  detail_not_found_title: '스킬을 찾을 수 없음',
  detail_view_on_github: 'GitHub에서 보기',
  detail_view_source: '소스 보기',

  // update-banner
  update_banner_available: 'v{version} 사용 가능',
  update_banner_download: '다운로드',
  update_banner_downloading: '업데이트를 다운로드하는 중...',
  update_banner_error: '오류: {message}',
  update_banner_ready: '업데이트 준비 완료',
  update_banner_restart: '재시작',
  update_banner_retry: '다시 시도',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
