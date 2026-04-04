import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const es = {
  // agent-checkbox-list
  agent_list_show_fewer: 'Mostrar menos',
  agent_list_show_more: 'Mostrar {count} más',

  // add-skill-dialog
  add_skill_agents: 'Agentes',
  add_skill_button: 'Añadir',
  add_skill_button_loading: 'Añadiendo...',
  add_skill_cancel: 'Cancelar',
  add_skill_error_fallback: 'No se pudo añadir el skill',
  add_skill_error_global: 'Global: {message}',
  add_skill_error_partial: 'Se añadió a {successCount} destino(s), pero falló: {errors}',
  add_skill_error_project: '{project}: {message}',
  add_skill_global: 'Global',
  add_skill_install_to: 'Instalar en',
  add_skill_loading_projects: 'Cargando proyectos...',
  add_skill_success: 'Se añadió el skill a {count} destino(s)!',
  add_skill_title: 'Añadir {name}',

  // batch-add-skill-dialog
  batch_add_button: 'Añadir',
  batch_add_button_loading: 'Añadiendo... ({progress})',
  batch_add_cancel: 'Cancelar',
  batch_add_error_fallback: 'No se pudieron añadir los skills',
  batch_add_error_global: 'Global/{source}: {message}',
  batch_add_error_partial: 'Se completaron {successCount} instalación(es), pero {errorCount} fallaron: {errors}',
  batch_add_error_project: '{project}/{source}: {message}',
  batch_add_global: 'Global',
  batch_add_install_to: 'Instalar en',
  batch_add_loading_projects: 'Cargando proyectos...',
  batch_add_success: 'Se añadieron {skillCount} skill(s) a {targetCount} destino(s)!',
  batch_add_title_one: 'Añadir {count} skill',
  batch_add_title_other: 'Añadir {count} skills',
  batch_agents: 'Agentes',

  // command-palette
  command_palette_actions: 'Acciones',
  command_palette_check_for_update: 'Buscar actualización',
  command_palette_empty: 'No se encontraron resultados.',
  command_palette_navigation: 'Navegación',
  command_palette_placeholder: 'Buscar...',
  command_palette_preferences: 'Preferencias',
  command_palette_skills: 'Skills',

  // common
  common_cancel: 'Cancelar',
  common_global: 'Global',

  // error-boundary
  error_boundary_message: 'Ocurrió un error inesperado',
  error_boundary_reload: 'Recargar app',
  error_boundary_title: 'Algo salió mal',

  // gallery-view
  gallery_no_repo_skills: 'No se encontraron skills en este repositorio',
  gallery_repo_search_section: 'Encontrados en GitHub',
  gallery_no_skills: 'No hay skills disponibles',
  gallery_no_skills_match: 'Ningún skill coincide con tu búsqueda',
  gallery_refresh: 'Actualizar',
  gallery_repo_section: 'Skills en {repo}',
  gallery_search_placeholder: 'Buscar skills...',
  gallery_select_mode_exit: 'Salir del modo de selección',
  gallery_select_mode_start: 'Seleccionar skills',
  gallery_subtitle: 'Explora y descubre los skills disponibles',
  gallery_title: 'Directorio de skills',

  // inline-error
  inline_error_retry: 'Reintentar',
  inline_error_title: 'Error',

  // installed-skills-view
  installed_add_from_directory: 'Añade skills del Directorio de skills a este proyecto',
  installed_all_up_to_date: 'Todo está actualizado',
  installed_check_errors_count: 'No se pudieron comprobar {count}',
  installed_check_errors_title: 'No se pudieron comprobar las actualizaciones',
  installed_check_for_updates: 'Buscar actualizaciones',
  installed_failed_to_remove: 'No se pudo eliminar: {names}',
  installed_failed_to_remove_skill: 'No se pudo eliminar el skill',
  installed_no_skills: 'No hay skills instalados',
  installed_no_skills_match: 'Ningún skill coincide con tu búsqueda',
  installed_project_skills: 'Skills del proyecto',
  installed_refresh: 'Actualizar',
  installed_remove_selected: 'Eliminar seleccionados',
  installed_search_placeholder: 'Buscar skills...',
  installed_select_mode_exit: 'Salir del modo de selección',
  installed_select_mode_start: 'Seleccionar skills',
  installed_skill_count: '{count} skill(s) instalados',
  installed_skill_count_label: '{count} skill(s)',
  installed_title: 'Skills globales',
  installed_update_all: 'Actualizar todo ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: 'Ocultar automáticamente',
  preferences_agents_description: 'Se preseleccionan al añadir skills. Haz clic en el ojo para ocultarlos.',
  preferences_agents_hide: 'Ocultar {name}',
  preferences_agents_hide_all: 'Ocultar todos',
  preferences_agents_show: 'Mostrar {name}',
  preferences_agents_show_all: 'Mostrar todos',
  preferences_agents_title: 'Agentes predeterminados',
  preferences_auto_update_check: 'Activar comprobaciones automáticas de actualizaciones',
  preferences_auto_update_description: 'Comprueba si hay nuevas versiones al iniciar',
  preferences_auto_update_title: 'Actualización automática',
  preferences_cancel: 'Cancelar',
  preferences_check_for_update: 'Buscar actualizaciones',
  preferences_up_to_date: 'Estás al día',
  preferences_update_available: 'v{version} disponible',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: 'Idioma',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: 'Ejecutor de paquetes usado al añadir skills',
  preferences_package_manager_label: 'Gestor de paquetes',
  preferences_package_manager_title: 'Gestor de paquetes',
  preferences_save: 'Guardar',
  preferences_section_agents: 'Agentes',
  preferences_section_general: 'General',
  preferences_title: 'Preferencias',

  // search-input
  search_clear: 'Borrar búsqueda',
  search_placeholder: 'Buscar...',

  // selection-action-bar
  selection_action_add: 'Añadir seleccionados',
  selection_count_one: '{count} skill seleccionado',
  selection_count_other: '{count} skills seleccionados',
  selection_deselect: 'Deseleccionar',
  selection_select_all: 'Seleccionar todo',

  // sidebar
  sidebar_click_to_confirm: 'Haz clic para confirmar',
  sidebar_fallback_notice: 'No se encontró {from}; se usa {to}',
  sidebar_global_skills: 'Skills globales',
  sidebar_import_project: 'Importar proyecto',
  sidebar_loading: 'Cargando...',
  sidebar_no_projects: 'No hay proyectos',
  sidebar_preferences: 'Preferencias',
  sidebar_projects: 'Proyectos',
  sidebar_remove: 'Eliminar',
  sidebar_remove_project: 'Eliminar proyecto',
  sidebar_skills_directory: 'Directorio de skills',

  // skill-card
  skill_card_add: 'Añadir skill',
  skill_card_checking: 'Comprobando...',
  skill_card_click_to_confirm: 'Haz clic para confirmar',
  skill_card_error: 'Error',
  skill_card_remove: 'Eliminar',
  skill_card_remove_skill: 'Eliminar skill',
  skill_card_select: 'Seleccionar {name}',
  skill_card_update: 'Actualizar',
  skill_card_updating: 'Actualizando...',

  // skill-detail-view
  detail_about: 'Acerca de',
  detail_add: 'Añadir',
  detail_error_description:
    'Este skill puede formar parte de un repositorio con varios skills donde el contenido no se puede localizar automáticamente.',
  detail_error_title: 'No se pudo cargar el contenido del skill',
  detail_from_source: 'de {source}',
  detail_go_back: 'Volver',
  detail_installed: 'Instalado',
  detail_installed_locally: 'instalado localmente',
  detail_installs: '{count} instalaciones',
  detail_not_found: 'No se pudo encontrar el skill "{id}"',
  detail_not_found_title: 'Skill no encontrado',
  detail_view_on_github: 'Ver en GitHub',
  detail_view_source: 'Ver fuente',

  // update-banner
  update_banner_available: 'v{version} disponible',
  update_banner_download: 'Descargar',
  update_banner_downloading: 'Descargando actualización...',
  update_banner_error: 'Error: {message}',
  update_banner_ready: 'Listo para actualizar',
  update_banner_restart: 'Reiniciar',
  update_banner_retry: 'Reintentar',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
