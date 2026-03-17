import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const de = {
  // agent-checkbox-list
  agent_list_show_fewer: 'Weniger anzeigen',
  agent_list_show_more: '{count} weitere anzeigen',

  // add-skill-dialog
  add_skill_agents: 'Agenten',
  add_skill_button: 'Hinzufügen',
  add_skill_button_loading: 'Wird hinzugefügt...',
  add_skill_cancel: 'Abbrechen',
  add_skill_error_fallback: 'Skill konnte nicht hinzugefügt werden',
  add_skill_error_global: 'Global: {message}',
  add_skill_error_partial: 'Zu {successCount} Ziel(en) hinzugefügt, aber fehlgeschlagen: {errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: 'Global',
  add_skill_install_to: 'Installieren in',
  add_skill_loading_projects: 'Projekte werden geladen...',
  add_skill_success: 'Skill wurde zu {count} Ziel(en) hinzugefügt!',
  add_skill_title: '{name} hinzufügen',

  // batch-add-skill-dialog
  batch_add_button: 'Hinzufügen',
  batch_add_button_loading: 'Wird hinzugefügt... ({progress})',
  batch_add_cancel: 'Abbrechen',
  batch_add_error_fallback: 'Skills konnten nicht hinzugefügt werden',
  batch_add_error_global: 'Global/{source}: {message}',
  batch_add_error_partial: '{successCount} Installation(en) abgeschlossen, aber {errorCount} fehlgeschlagen: {errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: 'Global',
  batch_add_install_to: 'Installieren in',
  batch_add_loading_projects: 'Projekte werden geladen...',
  batch_add_success: '{skillCount} skill(s) wurden zu {targetCount} Ziel(en) hinzugefügt!',
  batch_add_title_one: '{count} skill hinzufügen',
  batch_add_title_other: '{count} skills hinzufügen',
  batch_agents: 'Agenten',

  // command-palette
  command_palette_actions: 'Aktionen',
  command_palette_check_for_update: 'Nach Update suchen',
  command_palette_empty: 'Keine Ergebnisse gefunden.',
  command_palette_navigation: 'Navigation',
  command_palette_placeholder: 'Suchen...',
  command_palette_preferences: 'Einstellungen',
  command_palette_skills: 'Skills',

  // common
  common_cancel: 'Abbrechen',
  common_global: 'Global',

  // error-boundary
  error_boundary_message: 'Ein unerwarteter Fehler ist aufgetreten',
  error_boundary_reload: 'App neu laden',
  error_boundary_title: 'Etwas ist schiefgelaufen',

  // gallery-view
  gallery_no_repo_skills: 'In diesem Repository wurden keine skills gefunden',
  gallery_no_skills: 'Keine skills verfügbar',
  gallery_no_skills_match: 'Keine skills entsprechen deiner Suche',
  gallery_refresh: 'Aktualisieren',
  gallery_repo_section: 'Skills in {repo}',
  gallery_search_placeholder: 'Skills suchen...',
  gallery_select_mode_exit: 'Auswahlmodus beenden',
  gallery_select_mode_start: 'Skills auswählen',
  gallery_subtitle: 'Verfügbare skills durchsuchen und entdecken',
  gallery_title: 'Skill-Verzeichnis',

  // inline-error
  inline_error_retry: 'Erneut versuchen',
  inline_error_title: 'Fehler',

  // installed-skills-view
  installed_add_from_directory: 'Füge skills aus dem Skill-Verzeichnis zu diesem Projekt hinzu',
  installed_all_up_to_date: 'Alles ist auf dem neuesten Stand',
  installed_check_errors_count: '{count} konnten nicht geprüft werden',
  installed_check_errors_title: 'Updates konnten nicht geprüft werden',
  installed_check_for_updates: 'Nach Updates suchen',
  installed_failed_to_remove: 'Konnte nicht entfernen: {names}',
  installed_failed_to_remove_skill: 'Skill konnte nicht entfernt werden',
  installed_no_skills: 'Keine skills installiert',
  installed_no_skills_match: 'Keine skills entsprechen deiner Suche',
  installed_project_skills: 'Projekt-Skills',
  installed_refresh: 'Aktualisieren',
  installed_remove_selected: 'Ausgewählte entfernen',
  installed_search_placeholder: 'Skills suchen...',
  installed_select_mode_exit: 'Auswahlmodus beenden',
  installed_select_mode_start: 'Skills auswählen',
  installed_skill_count: '{count} skill(s) installiert',
  installed_skill_count_label: '{count} skill(s)',
  installed_title: 'Globale Skills',
  installed_update_all: 'Alle aktualisieren ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: 'Automatisch ausblenden',
  preferences_agents_description: 'Beim Hinzufügen von skills vorausgewählt. Klicke auf das Auge, um sie auszublenden.',
  preferences_agents_hide: '{name} ausblenden',
  preferences_agents_hide_all: 'Alle ausblenden',
  preferences_agents_show: '{name} anzeigen',
  preferences_agents_show_all: 'Alle anzeigen',
  preferences_agents_title: 'Standard-Agenten',
  preferences_auto_update_check: 'Automatische Update-Prüfungen aktivieren',
  preferences_auto_update_description: 'Beim Start nach neuen Versionen suchen',
  preferences_auto_update_title: 'Automatische Updates',
  preferences_cancel: 'Abbrechen',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: 'Sprache',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: 'Package-Runner, der beim Hinzufügen von skills verwendet wird',
  preferences_package_manager_label: 'Paketmanager',
  preferences_package_manager_title: 'Paketmanager',
  preferences_save: 'Speichern',
  preferences_title: 'Einstellungen',

  // search-input
  search_clear: 'Suche löschen',
  search_placeholder: 'Suchen...',

  // selection-action-bar
  selection_action_add: 'Ausgewählte hinzufügen',
  selection_count: '{count} skill(s) ausgewählt',
  selection_deselect: 'Auswahl aufheben',
  selection_select_all: 'Alle auswählen',

  // sidebar
  sidebar_click_to_confirm: 'Klicken zum Bestätigen',
  sidebar_fallback_notice: '{from} nicht gefunden — {to} wird verwendet',
  sidebar_global_skills: 'Globale Skills',
  sidebar_import_project: 'Projekt importieren',
  sidebar_loading: 'Laden...',
  sidebar_no_projects: 'Keine Projekte',
  sidebar_preferences: 'Einstellungen',
  sidebar_projects: 'Projekte',
  sidebar_remove: 'Entfernen',
  sidebar_remove_project: 'Projekt entfernen',
  sidebar_skills_directory: 'Skill-Verzeichnis',

  // skill-card
  skill_card_add: 'Skill hinzufügen',
  skill_card_checking: 'Wird geprüft...',
  skill_card_click_to_confirm: 'Klicken zum Bestätigen',
  skill_card_error: 'Fehler',
  skill_card_remove: 'Entfernen',
  skill_card_remove_skill: 'Skill entfernen',
  skill_card_select: '{name} auswählen',
  skill_card_update: 'Aktualisieren',
  skill_card_updating: 'Wird aktualisiert...',

  // skill-detail-view
  detail_about: 'Über',
  detail_add: 'Hinzufügen',
  detail_error_description: 'Dieser Skill ist möglicherweise Teil eines Repositorys mit mehreren skills, dessen Inhalt nicht automatisch gefunden werden kann.',
  detail_error_title: 'Skill-Inhalt konnte nicht geladen werden',
  detail_from_source: 'von {source}',
  detail_go_back: 'Zurück',
  detail_installed: 'Installiert',
  detail_installed_locally: 'lokal installiert',
  detail_installs: '{count} Installationen',
  detail_not_found: 'Skill "{id}" konnte nicht gefunden werden',
  detail_not_found_title: 'Skill nicht gefunden',
  detail_view_on_github: 'Auf GitHub ansehen',
  detail_view_source: 'Quellcode ansehen',

  // update-banner
  update_banner_available: 'v{version} verfügbar',
  update_banner_download: 'Herunterladen',
  update_banner_downloading: 'Update wird heruntergeladen...',
  update_banner_error: 'Fehler: {message}',
  update_banner_ready: 'Bereit für das Update',
  update_banner_restart: 'Neustart',
  update_banner_retry: 'Erneut versuchen',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
