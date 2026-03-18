import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const es = {
  // common
  common_download: 'Descargar',
  common_github: 'GitHub',
  common_footer_rights: 'Todos los derechos reservados.',

  // home - hero
  home_hero_title: 'Explora, instala y gestiona habilidades de agentes IA visualmente',
  home_hero_description:
    'SkillPad es una interfaz gráfica de escritorio para skills.sh. Explora habilidades desde la galería, instálalas en cualquier agente con un clic y gestiona habilidades globales y de proyecto en un solo lugar.',
  home_hero_whats_agent_skills: '¿Qué son las habilidades de agente?',

  // home - features
  home_feature_gallery_title: 'Exploración de galería',
  home_feature_gallery_description: 'Descubre nuevas habilidades directamente desde la galería de skills.sh.',
  home_feature_install_title: 'Instalación con un clic',
  home_feature_install_description: 'Instala en tu agente preferido sin tocar la terminal.',
  home_feature_scope_title: 'Alcance flexible',
  home_feature_scope_description: 'Gestiona habilidades globales y de proyecto lado a lado.',
  home_feature_updates_title: 'Actualizaciones automáticas',
  home_feature_updates_description: 'Mantente al día con verificaciones de actualización integradas.',

  // home - what is agent skills
  home_whats_title: '¿Qué son las habilidades de agente?',
  home_whats_description_1:
    'Las habilidades de agente son archivos markdown que proporcionan a los agentes de codificación IA conocimientos especializados que no tienen de serie. Piensa en ellas como complementos para tu IA — instala una habilidad y tu agente sabrá hacer algo nuevo al instante.',
  home_whats_plugins_label: 'complementos para tu IA',
  home_whats_description_2:
    'Por ejemplo, una habilidad puede enseñar a tu agente a escribir mejores componentes React, seguir las convenciones de código de tu equipo, automatizar tareas del navegador o gestionar tu espacio de trabajo en Slack.',
  home_whats_markdown_title: 'Solo markdown',
  home_whats_markdown_description:
    'Cada habilidad es un archivo SKILL.md con instrucciones enfocadas y estructuradas que tu agente lee en tiempo de ejecución.',
  home_whats_agents_title: 'Funciona con cualquier agente',
  home_whats_agents_description:
    'Claude Code, Cursor, Windsurf y más. Las habilidades usan el estándar abierto skills.sh.',
  home_whats_scope_title: 'Global o por proyecto',
  home_whats_scope_description:
    'Instala habilidades globalmente para todos los proyectos, o limítalas a un proyecto específico.',
  home_whats_community_title: 'Impulsado por la comunidad',
  home_whats_community_description:
    'Explora cientos de habilidades en skills.sh, o crea las tuyas y compártelas con otros.',

  // home - badge
  home_badge_title: 'Insignia Available on SkillPad',
  home_badge_description: 'Incrusta esta insignia en tu README para instalación con un clic.',
  home_badge_try: 'Prueba:',
  home_badge_clear: 'Limpiar',

  // home - cta
  home_cta_title: 'Descargar SkillPad',
  home_cta_description: 'Gratuito y de código abierto. Disponible para macOS y Windows.',

  // download
  download_title: 'Descargar SkillPad',
  download_description: 'Disponible para macOS y Windows. Gratuito y de código abierto.',
  download_version: 'Versión {tag} \u00b7 Publicado el {date}',
  download_error: 'No se pudo cargar la información de la versión.',
  download_error_cta: 'Ver versiones en GitHub',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 o posterior',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 o posterior (64 bits)',
  download_recommended: 'Recomendado',
  download_not_available: 'No disponible',
  download_all_releases: 'Ver todas las versiones en GitHub',

  // install
  install_opening: 'Abriendo SkillPad...',
  install_opening_description: 'Intentando abrir {skillId} en la aplicación.',
  install_not_installed: 'SkillPad no está instalado',
  install_not_installed_description:
    'SkillPad te permite explorar e instalar habilidades de agentes IA con una interfaz visual.',
  install_skill_id: 'ID de habilidad',
  install_download: 'Descargar SkillPad',
  install_try_again: 'Reintentar',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
